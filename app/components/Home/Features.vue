<script setup lang="ts"></script>

<template>
	<div
		class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 bg-zinc-100 dark:bg-zinc-700 grid grid-cols-1 xl:grid-cols-2 place-items-center"
	>
		<NuxtImg
			src="/svg/chat.svg"
			width="400"
			draggable="false"
			alt="Chat service"
			class="hidden xl:block"
		/>
		<div class="max-w-full xl:max-w-lg">
			<h3 class="font-semibold text-violet-500 dark:text-violet-400 uppercase">
				{{ $t("home.features.communicate.title") }}
			</h3>
			<p>
				{{ $t("home.features.communicate.description") }}
			</p>
		</div>
	</div>

	<div
		class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 grid grid-cols-1 xl:grid-cols-2 place-items-center"
	>
		<div class="max-w-full xl:max-w-lg">
			<h3 class="font-semibold text-violet-500 dark:text-violet-400 uppercase">
				{{ $t("home.features.p2p.title") }}
			</h3>
			<p class="text-sm xl:text-base">
				{{ $t("home.features.p2p.description") }}
			</p>
		</div>
		<NuxtImg
			src="/svg/p2p.svg"
			width="400"
			draggable="false"
			alt="Interconnected users on P2P network"
			class="hidden xl:block"
		/>
	</div>

	<div
		class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 bg-zinc-100 dark:bg-zinc-700 grid grid-cols-1 xl:grid-cols-2 place-items-center"
	>
		<NuxtImg
			src="/svg/encryption.svg"
			width="400"
			draggable="false"
			alt="Person over secured data"
			class="hidden xl:block"
		/>
		<div class="max-w-full xl:max-w-lg">
			<h3 class="font-semibold text-violet-500 dark:text-violet-400 uppercase">
				{{ $t("home.features.cipher.title") }}
			</h3>
			<p>
				{{ $t("home.features.cipher.description") }}
			</p>
		</div>
	</div>
</template>
