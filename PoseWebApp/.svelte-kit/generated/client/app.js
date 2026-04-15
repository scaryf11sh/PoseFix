export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [4,[2]],
		"/(app)/account": [5,[2]],
		"/(app)/account/delete": [6,[2]],
		"/(app)/account/notifications": [7,[2]],
		"/(app)/account/password": [8,[2]],
		"/auth": [17],
		"/(app)/camera": [9,[2]],
		"/(app)/exercises": [10,[2]],
		"/(app)/exercises/[id]": [11,[2]],
		"/(app)/export": [12,[2]],
		"/(app)/gallery": [13,[2]],
		"/onboarding": [18,[3]],
		"/(app)/progress": [14,[2]],
		"/(app)/progress/[id]": [15,[2]],
		"/(app)/settings": [16,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';