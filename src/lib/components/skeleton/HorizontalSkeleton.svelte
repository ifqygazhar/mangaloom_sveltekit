<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="mb-2 flex w-screen flex-col overflow-hidden">
	<div class="pl-4">
		<Skeleton class="h-8 w-64 pt-4" />
		<Skeleton class="mt-2 h-5 w-80" />
	</div>

	<div class="mt-4 flex flex-row space-x-4 px-4">
		{#each Array(6) as index (index)}
			<div class="flex-shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/5 md:basis-1/4 xl:basis-1/6">
				<div class="flex flex-col space-y-2">
					<Skeleton class="aspect-[3/4] w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
				</div>
			</div>
		{/each}
	</div>
</div>
