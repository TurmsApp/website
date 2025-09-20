<script lang="ts" setup>
import { cn } from "~/utils/inspira";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

interface Props {
	text?: string;
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	text: "Button",
});

const buttonRef = ref<HTMLButtonElement>();
</script>

<template>
	<button
		ref="buttonRef"
		:class="
			cn(
				'group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold',
				props.class,
			)
		"
	>
		<div class="flex items-center gap-2">
			<div
				class="scale-100 bg-primary transition-all duration-300 group-hover:scale-[100.8]"
			></div>
			<span
				class="flex whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
			>
				<ArrowDownTrayIcon class="size-6 mr-2" />
				<slot />
			</span>
		</div>

		<div
			class="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
		>
			<span class="whitespace-nowrap"><slot /></span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="size-6"
			>
				<path d="M5 12h14" />
				<path d="m12 5 7 7-7 7" />
			</svg>
		</div>
	</button>
</template>
