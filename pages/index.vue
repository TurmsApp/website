<template>
    <div class="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div>
            <h1 class="font-bold text-4xl xl:text-6xl">Turms, messagerie</h1>
            <h2 class="font-bold text-4xl xl:text-6xl">pair-à-pair et chiffrée.</h2>

            <div class="mt-12 flex justify-center gap-x-6">
                <button
                    class="rounded-md px-6 py-4 select-none cursor-pointer text-zinc-100 bg-violet-500 hover:bg-violet-600 transition-colors disabled:bg-opacity-70 disabled:hover:bg-violet-500/70 disabled:cursor-not-allowed"
                    type="button"
                    disabled
                >
                    Télécharger pour Windows
                </button>

                <a
                    class="rounded-md px-6 py-4 select-none text-zinc-500 bg-transparent border border-zinc-200 hover:text-zinc-700 hover:border-zinc-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/TurmsApp/discovery"
                >
                    Héberger sa propre instance
                </a>
            </div>
        </div>
    </div>
</template>