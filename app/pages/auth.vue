<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const token = useState("token");

onMounted(() => {
  window.location.href = `turms://${token.value}`;
});
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <p>You're in! You can close this page.</p>
    <p class="hidden">{{ token }}</p>
  </div>
</template>
