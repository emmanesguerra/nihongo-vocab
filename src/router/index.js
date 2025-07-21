import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import VocabSummaryPage from '../pages/VocabSummaryPage.vue'
import VocabPageLesson from '../pages/VocabPageLesson.vue'
import VocabPageKanji from '../pages/VocabPageKanji.vue'
import ExamPage from '../pages/ExamPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/vocab-summary', component: VocabSummaryPage },
  { path: '/vocab-list', component: VocabPageLesson },
  { path: '/kanji-list', component: VocabPageKanji },
  { path: '/exam', component: ExamPage },
  { path: '/history', component: HistoryPage }
]

export const router = createRouter({
  history: createWebHashHistory(), // ✅ Use hash mode for GitHub Pages
  routes
})
