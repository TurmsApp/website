<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const error = useState("error");
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-center">
    <p>An error occured.</p>
    <p class="text-red-500 max-w-lg">{{ error }}</p>
  </div>
</template>
