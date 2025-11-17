<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const error = useState("error");
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <p>An error occured.</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>
