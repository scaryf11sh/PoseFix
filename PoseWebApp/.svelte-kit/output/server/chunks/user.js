import { w as writable } from "./index.js";
import { convertFileSrc } from "@tauri-apps/api/core";
function createUserStore() {
  const { subscribe, set, update } = writable({
    user: null,
    avatarUrl: null
  });
  return {
    subscribe,
    // Carga el usuario y resuelve el avatar desde la ruta guardada en DB
    setUser(user) {
      const avatarUrl = user?.avatar_path ? convertFileSrc(user.avatar_path) : null;
      set({ user, avatarUrl });
    },
    // Usa un dataUrl (base64) para mostrar el avatar inmediatamente
    // sin depender de convertFileSrc que puede tener caché en Tauri
    setAvatarDataUrl(dataUrl, path) {
      update((s) => ({
        avatarUrl: dataUrl,
        user: s.user ? { ...s.user, avatar_path: path } : null
      }));
    },
    clear() {
      set({ user: null, avatarUrl: null });
    }
  };
}
const userStore = createUserStore();
export {
  userStore as u
};
