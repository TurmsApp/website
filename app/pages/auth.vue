<script setup lang="ts">
import crypto from "crypto";
const { signature, id, key, authenticatorData, clientDataJSON } =
	useRoute().query;

const generateChallenge = (length = 32) => {
	return crypto.randomBytes(length);
};

if (!id || !key) {
	const challenge = btoa(String.fromCharCode(...generateChallenge()));
	await navigateTo(
		`https://account.gravitalia.com/authorize?redirect=https://turms.gravitalia.com/auth&challenge=${challenge}`,
		{ external: true, redirectCode: 307 },
	);
}
</script>

<template>
	<div class="h-screen w-screen flex items-center justify-center">
		<p>Not disponible yet! Try anonymous mode.</p>
	</div>
</template>
