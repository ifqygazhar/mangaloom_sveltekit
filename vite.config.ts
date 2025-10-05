import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [enhancedImages(), tailwindcss(), sveltekit()],
	preview: {
		host: true,
		port: 3000,
		allowedHosts: [
			'mangaloom.app',
			'www.mangaloom.app'
		]
	}
});
