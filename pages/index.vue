<template>
  <div
    class="relative flex h-screen w-full items-center justify-center overflow-hidden"
  >
    <div>
      <h1 class="font-bold text-2xl xl:text-6xl">Turms, messagerie</h1>
      <h2 class="font-bold text-2xl xl:text-6xl">pair-à-pair et chiffrée.</h2>

      <div class="mt-12 flex flex-col xl:flex-row justify-center gap-6">
        <button
          class="rounded-md px-6 py-4 select-none cursor-pointer text-zinc-100 bg-violet-500 hover:bg-violet-600 transition-colors disabled:bg-opacity-70 disabled:hover:bg-violet-500/70 disabled:cursor-not-allowed"
          type="button"
          disabled
        >
          Télécharger pour Windows
        </button>

        <a
          class="rounded-md px-6 py-4 select-none text-zinc-500 dark:text-zinc-300 bg-transparent border border-zinc-200 dark:border-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:border-zinc-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/TurmsApp/discovery"
        >
          Héberger sa propre instance
        </a>
      </div>
    </div>
  </div>

  <!-- Features explanation. -->
  <div id="features">
    <div
      class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 bg-zinc-200 dark:bg-zinc-700 grid grid-cols-1 xl:grid-cols-2 place-items-center"
    >
      <NuxtImg
        src="/svg/secure.svg"
        width="400"
        alt="Woman handling a shield around servers"
        class="hidden xl:block"
      />
      <div class="max-w-full xl:max-w-lg">
        <h3
          class="font-semibold text-violet-500 dark:text-violet-400 uppercase"
        >
          Sécurisé
        </h3>
        <p>
          Conçu d'abord pour la sécurité, l'échange de clés entre pairs
          s'effectue via la méthode Diffie-Hellman, ce qui empêche tout
          attaquant ou serveur d'intercepter les clés, y compris lors des
          premiers échanges. Une fois les clés sécurisées et enregistrées, les
          correspondants échangent des messages chiffrés en utilisant
          l'algorithme RSA.
        </p>
      </div>
    </div>

    <div
      class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 grid grid-cols-1 xl:grid-cols-2 place-items-center"
    >
      <div class="max-w-full xl:max-w-lg">
        <h3
          class="font-semibold text-violet-500 dark:text-violet-400 uppercase"
        >
          Pair-à-pair
        </h3>
        <p class="text-sm xl:text-base">
          Lorsque les deux pairs sont connectés sans qu'aucun proxy n'entrave la
          connexion, les échanges se déroulent directement entre eux, sans
          l'intervention d'un serveur. En revanche, si l'un des pairs n'est pas
          en ligne en même temps que l'autre, le message chiffré est
          temporairement stocké sur un serveur en attendant d'être délivré. De
          la même manière, si un proxy bloque la connexion pair-à-pair, les
          messages chiffrés sont acheminés via des serveurs relais (TURN) qui ne
          peuvent pas déchiffrer le message.
        </p>
      </div>
      <NuxtImg
        src="/svg/connected_world.svg"
        width="400"
        alt="World map with connected areas"
        class="hidden xl:block"
      />
    </div>

    <div
      class="h-full max-h-xl w-full py-12 xl:py-24 px-10 xl:px-56 bg-zinc-200 dark:bg-zinc-700 grid grid-cols-1 xl:grid-cols-2 place-items-center"
    >
      <NuxtImg
        src="/svg/server.svg"
        width="400"
        alt="Server"
        class="hidden xl:block"
      />
      <div class="max-w-full xl:max-w-lg">
        <h3
          class="font-semibold text-violet-500 dark:text-violet-400 uppercase"
        >
          Auto-hébérgeable
        </h3>
        <p>
          Moyennant la désactivation de la recherche de pairs aléatoires et la
          visibilité de votre compte aux autres, vous pouvez héberger votre
          propre serveur de découverte pour ne pas dépendre du serveur public.
          Votre serveur pourra sauvegarder les messages reçus en votre absence
          au lieu qu'ils soient enregistrés sur un serveur Gravitalia. Vous ne
          serez pas un serveur relais.
        </p>
      </div>
    </div>
  </div>
</template>
