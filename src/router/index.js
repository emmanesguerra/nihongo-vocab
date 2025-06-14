import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import VocabPage from '../pages/VocabPage.vue'
import ExamPage from '../pages/ExamPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/vocab', component: VocabPage },
  { path: '/exam', component: ExamPage }
]

export const router = createRouter({
  history: createWebHistory('/nihongo-vocab/'), // Set base path for GitHub Pages
  routes
})
