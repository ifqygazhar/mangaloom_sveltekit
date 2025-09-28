<script lang="ts">
	import Fa from 'svelte-fa';
	import { links, useCurrentPath, isActive } from '$lib/utils/navigation';
	const currentPath = useCurrentPath();
</script>

<nav class="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-700 bg-secondary lg:hidden">
	<ul class="flex h-full items-center justify-around py-2">
		{#each links as link (link.id)}
			<li>
				<a
					href={link.href}
					class={`flex flex-col items-center rounded-md p-3 text-sm transition-colors ${
						isActive($currentPath, link.href) ? 'bg-primary text-black' : 'text-white'
					}`}
					aria-current={isActive($currentPath, link.href) ? 'page' : null}
				>
					{#if link.icon}
						<Fa icon={link.icon} class="mb-1" style="width:1.25rem;height:1.25rem;" />
					{/if}
					<span>{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
