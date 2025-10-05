<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import { useCurrentPath, links, isActive } from '$lib/utils/navigation';
	import { resolve } from '$app/paths';
	const currentPath = useCurrentPath();
</script>

<div class="flex items-center gap-4">
	<a href="/" aria-label="Beranda Mangaloom" class="flex flex-shrink-0 items-center">
		<img src={logo} alt="Mangaloom Logo" class="logo-img h-16 w-16" />
	</a>

	<nav aria-label="Navigasi Utama" class="hidden lg:block">
		<ul class="flex h-full items-center gap-4">
			{#each links as link (link.id)}
				<li>
					<a
						href={resolve(link.href)}
						class={`nav-link flex h-full items-center rounded px-3 py-2 transition-colors ${
							isActive($currentPath, link.href)
								? 'bg-primary text-black'
								: 'text-white hover:bg-primary hover:text-black '
						}`}
						aria-current={isActive($currentPath, link.href) ? 'page' : null}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
