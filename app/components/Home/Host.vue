<script setup lang="ts">
import BlurReveal from "../Animation/BlurReveal.vue";
import InteractiveHoverButton from "../Button/InteractiveHoverButton.vue";
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <ClientOnly>
      <BlurReveal
        :delay="0.2"
        :duration="0.75"
        class="flex flex-col items-center justify-center p-8"
      >
        <h2
          class="text-3xl font-bold tracking-tighter xl:text-6xl/none sm:text-5xl"
        >
          {{ $t("home.host.title") }}
        </h2>
        <p class="text-xl">{{ $t("home.host.subtitle") }}</p>

        <NuxtLink to="https://github.com/TurmsApp"
          ><InteractiveHoverButton class="mt-12">
            {{ $t("home.host.host_instances") }}
          </InteractiveHoverButton></NuxtLink
        >
      </BlurReveal>
    </ClientOnly>
  </div>
</template>
