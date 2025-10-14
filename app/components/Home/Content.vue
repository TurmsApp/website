<script setup lang="ts">
import Ripple from "../Animation/Ripple.vue";
import InteractiveHoverButton from "../Button/InteractiveHoverButton.vue";
import Features from "./Features.vue";
import Host from "./Host.vue";
import Title from "./Title.vue";
</script>

<template>
  <Title>
    <InteractiveHoverButton class="mt-6 z-10">{{
      $t("home.download")
    }}</InteractiveHoverButton>
    <div class="mt-2 flex select-none">
      <p class="text-xs">{{ $t("home.available_on") }}&nbsp;</p>
      <p class="sr-only">macOS</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 15.591 18.144"
        class="mt-0.5 size-3 dark:fill-white"
      >
        <path
          d="M15.591 13.312a13 13 0 0 1-1.178 2.2c-.765 1.165-1.845 2.619-3.181 2.629-1.188.01-1.494-.775-3.107-.762s-1.948.777-3.137.764c-1.335-.012-2.358-1.322-3.124-2.485C-.276 12.396-.502 8.573.821 6.539A4.74 4.74 0 0 1 4.63 4.25c1.417 0 2.307.779 3.479.779 1.136 0 1.829-.781 3.467-.781a4.63 4.63 0 0 1 3.486 1.84 3.989 3.989 0 0 0 .529 7.224M10.333 2.946A3.98 3.98 0 0 0 11.217 0a4.3 4.3 0 0 0-2.779 1.492 3.7 3.7 0 0 0-.9 2.873 3.62 3.62 0 0 0 2.8-1.419Z"
        />
      </svg>
    </div>
    <Ripple
      circle-class="border-[hsl(var(--primary))] rounded-full"
      :wave-speed="20"
      :space-between-circle="160"
    />
  </Title>
  <Features />
  <Host />
</template>
