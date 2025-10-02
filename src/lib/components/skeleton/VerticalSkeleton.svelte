<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="mb-2 flex w-screen flex-col">
	<div class="pl-4">
		<Skeleton class="h-8 w-64 pt-4" />
		<Skeleton class="mt-2 h-5 w-80" />
	</div>

	<div class="px-4 pt-4 pb-6">
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 xl:grid-cols-6">
			{#each Array(12) as index (index)}
				<div class="flex flex-col space-y-2">
					<Skeleton class="aspect-[3/4] w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
				</div>
			{/each}
		</div>
	</div>
</div>
