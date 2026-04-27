import { writable } from 'svelte/store';
import { listen } from '@tauri-apps/api/event';
import { browser } from '$app/environment';

export type BleStatus = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'streaming';

export interface SensorAngle {
    pitch: number;
    roll:  number;
    yaw:   number;
}

export interface BleScanResult {
    address: string;
    name:    string;
    rssi?:   number;
}

export interface BleSensorData {
    nonce: number;
    head:  SensorAngle | null;
    back:  SensorAngle | null;
}

export interface BleState {
    status:      BleStatus;
    address:     string;
    scanResults: BleScanResult[];
    sensorData:  BleSensorData | null;
    error:       string | null;
}

function createBleStore() {
    const { subscribe, update, set } = writable<BleState>({
        status:      'disconnected',
        address:     '',
        scanResults: [],
        sensorData:  null,
        error:       null,
    });

    if (browser) {
        listen<{ connected: boolean; address: string }>('ble://status', (e) => {
            update(s => ({
                ...s,
                status:     e.payload.connected ? 'connected' : 'disconnected',
                address:    e.payload.connected ? e.payload.address : '',
                sensorData: e.payload.connected ? s.sensorData : null,
                error:      null,
            }));
        });

        listen<BleSensorData>('ble://sensor-data', (e) => {
            update(s => ({ ...s, status: 'streaming', sensorData: e.payload }));
        });
    }

    return {
        subscribe,
        setScanning:    ()                        => update(s => ({ ...s, status: 'scanning',    scanResults: [], error: null })),
        setScanResults: (r: BleScanResult[])      => update(s => ({ ...s, status: 'disconnected', scanResults: r })),
        setConnecting:  (address: string)         => update(s => ({ ...s, status: 'connecting',   address, error: null })),
        setError:       (error: string)           => update(s => ({ ...s, error, status: 'disconnected' })),
        reset: () => set({ status: 'disconnected', address: '', scanResults: [], sensorData: null, error: null }),
    };
}

export const bleStore = createBleStore();
