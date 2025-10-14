<script setup lang="ts">
import Content from "~/components/Home/Content.vue";
import Footer from "~/components/Home/Footer.vue";

defineRouteRules({
  prerender: true,
});
</script>

<template>
  <main>
    <Content />
    <Footer />
  </main>
</template>
