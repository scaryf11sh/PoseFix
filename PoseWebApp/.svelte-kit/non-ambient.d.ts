
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/(app)/account" | "/(app)/account/delete" | "/(app)/account/notifications" | "/(app)/account/password" | "/auth" | "/(app)/camera" | "/(app)/exercises" | "/(app)/exercises/[id]" | "/(app)/export" | "/(app)/gallery" | "/onboarding" | "/(app)/progress" | "/(app)/progress/[id]" | "/(app)/settings";
		RouteParams(): {
			"/(app)/exercises/[id]": { id: string };
			"/(app)/progress/[id]": { id: string }
		};
		LayoutParams(): {
			"/(app)": { id?: string };
			"/": { id?: string };
			"/(app)/account": Record<string, never>;
			"/(app)/account/delete": Record<string, never>;
			"/(app)/account/notifications": Record<string, never>;
			"/(app)/account/password": Record<string, never>;
			"/auth": Record<string, never>;
			"/(app)/camera": Record<string, never>;
			"/(app)/exercises": { id?: string };
			"/(app)/exercises/[id]": { id: string };
			"/(app)/export": Record<string, never>;
			"/(app)/gallery": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/(app)/progress": { id?: string };
			"/(app)/progress/[id]": { id: string };
			"/(app)/settings": Record<string, never>
		};
		Pathname(): "/" | "/account" | "/account/" | "/account/delete" | "/account/delete/" | "/account/notifications" | "/account/notifications/" | "/account/password" | "/account/password/" | "/auth" | "/auth/" | "/camera" | "/camera/" | "/exercises" | "/exercises/" | `/exercises/${string}` & {} | `/exercises/${string}/` & {} | "/export" | "/export/" | "/gallery" | "/gallery/" | "/onboarding" | "/onboarding/" | "/progress" | "/progress/" | `/progress/${string}` & {} | `/progress/${string}/` & {} | "/settings" | "/settings/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/icon.png" | "/icon.svg" | "/profile-img.jpg" | "/robots.txt" | string & {};
	}
}