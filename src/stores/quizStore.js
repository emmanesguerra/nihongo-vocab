import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    settings: {
      totalQuestions: 10,
      lessonRange: [1, 10],
    }
  }),
  actions: {
    setSettings(totalQuestions, range) {
      this.settings.totalQuestions = totalQuestions
      this.settings.lessonRange = range
    }
  }
})
