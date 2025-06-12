<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div
        class="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl"
      >
        <a href="/" class="flex items-center">
          <img
            src="https://www.muangthai.co.th/assets/cd748ac7-e5fd-4dcd-9f62-a6d071c69f30/MTLLogo.svg"
            class="h-6 sm:h-9"
            alt="muangthai Logo"
          />
        </a>
      </div>
    </nav>
  </header>
  <main class="h-full bg-gray-50">
    <section class="block mx-auto max-w-7xl px-4 py-8 antialiased md:py-16">
      <slot />
    </section>
  </main>
  <footer class="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
    <div class="mx-auto max-w-screen-xl text-center">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
        >© 2025 AllRights Reserved.</span
      >
    </div>
  </footer>
</template>

<script setup>
import { initFlowbite } from "flowbite";
import { onMounted } from "vue";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});
</script>
