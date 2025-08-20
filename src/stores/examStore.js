import { defineStore } from 'pinia'
import { buildQuestions } from '@/core/utils/questionBuilder'

export const useExamStore = defineStore('exam', {
    state: () => ({
        questions: [],
        answers: [],
        currentIndex: 0,
        started: false,
    }),
    getters: {
        currentQuestion(state) {
            return state.questions[state.currentIndex] ?? null
        },
        isLast(state) {
            return state.currentIndex >= state.questions.length - 1
        },
        progress(state) {
            return { index: state.currentIndex + 1, total: state.questions.length }
        },
    },
    actions: {
        init(settings) {
            const qs = buildQuestions(settings.totalQuestions, settings.lessonRange)
            this.questions = qs
            this.answers = Array(qs.length).fill(null)
            this.currentIndex = 0
            this.started = true
        },
        saveAnswer(index, answer) {
            this.answers[index] = answer
        },
        next() {
            if (this.currentIndex < this.questions.length - 1) this.currentIndex++
        },
        reset() {
            this.questions = []
            this.answers = []
            this.currentIndex = 0
            this.started = false
        },
    },
})
