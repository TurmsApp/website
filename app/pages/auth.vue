<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

onMounted(() => {
  window.close();
});
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <p>You're in! You can close this page.</p>
  </div>
</template>
