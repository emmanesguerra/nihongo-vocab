import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import VocabPage from '../pages/VocabPage.vue'
import ExamPage from '../pages/ExamPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/vocab', component: VocabPage },
  { path: '/exam', component: ExamPage }
]

export const router = createRouter({
  history: createWebHashHistory(), // ✅ Use hash mode for GitHub Pages
  routes
})
