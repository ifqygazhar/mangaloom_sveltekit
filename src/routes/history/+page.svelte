<script lang="ts">
	import History from '@lucide/svelte/icons/history';
</script>

<div class="flex flex-col gap-2 p-4">
	<div class="flex w-full flex-col gap-2 rounded-md bg-third">
		<div class="flex flex-row items-center p-2">
			<History class="mr-1 block h-6 w-6 text-white" />
			<div class="flex flex-col items-center justify-center">
				<span class="font-semibold text-white">title</span>
				<span class="text-white">date</span>
			</div>
		</div>
	</div>
</div>
