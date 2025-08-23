import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import VocabSummaryPage from '../pages/VocabSummaryPage.vue'
import VocabPage from '../pages/VocabPage.vue'
import ExamPage from '../pages/ExamPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import Alphabet from '../pages/Alphabet.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/vocab-summary', component: VocabSummaryPage },
  { path: '/vocab-list', component: VocabPage },
  { path: '/exam', component: ExamPage },
  { path: '/history', component: HistoryPage },
  { path: '/alphabet', component: Alphabet }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
