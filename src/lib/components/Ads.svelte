<script lang="ts">
	import logo from '$lib/assets/logo.svg';

	let { icon, title, btnText, url } = $props<{
		title?: string;
		btnText?: string;
		url?: string;
	}>();

	function openExternal() {
		window.open(url, '_blank', 'noopener,noreferrer')?.focus();
	}
</script>

<div class="p-4">
	<div class="flex w-full flex-row gap-2 border-2 border-primary p-4">
		<img src={logo} alt="Mangaloom logo" class="h-16 w-16" />
		<div class="flex-flex col gap-2">
			<h2 class="mb-1 text-[0.8rem] font-bold text-white md:text-[1rem] lg:text-[1rem]">
				{title}
			</h2>
			<button class="cursor-pointer" onclick={openExternal}
				><div
					class="group flex w-25 items-center gap-2 bg-primary p-1 hover:bg-primary md:border-2 md:border-primary md:bg-transparent"
				>
					{#if icon != null}
						{@render icon?.()}
					{/if}
					<h2 class="text-[0.8rem] text-black md:text-[1rem] md:text-white lg:text-[1rem]">
						{btnText}
					</h2>
				</div></button
			>
		</div>
	</div>
</div>
