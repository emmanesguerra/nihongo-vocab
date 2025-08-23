<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.path,
  (newPath) => {
    if (newPath.startsWith('/vocab')) {
      document.body.classList.remove('default-layout')
      document.body.classList.remove('alpha-layout')
      document.body.classList.add('vocab-layout')
    } else if (newPath.startsWith('/alphabet')) {
      document.body.classList.remove('vocab-layout')
      document.body.classList.remove('default-layout')
      document.body.classList.add('alpha-layout')
    } else {
      document.body.classList.remove('vocab-layout')
      document.body.classList.remove('alpha-layout')
      document.body.classList.add('default-layout')
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* Ensure v-main takes up the full viewport */
.v-main {
  height: 100vh;
}
</style>