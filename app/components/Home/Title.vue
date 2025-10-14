<template>
  <div
    class="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden lg:w-full md:w-full"
  >
    <p class="z-10 text-5xl font-medium">
      {{ $t("home.title") }}
    </p>
    <small>{{ $t("home.subtitle") }}</small>
    <slot />
  </div>
</template>
