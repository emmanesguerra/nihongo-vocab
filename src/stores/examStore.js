import { defineStore } from 'pinia'
import { buildQuestions } from '@/core/utils/questionBuilder'

export const useExamStore = defineStore('exam', {
    state: () => ({
        questions: [],       // each question will carry its own `userAnswer`
        currentIndex: 0,
        started: false,
        finished: false,
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
        score(state) {
            return state.questions.reduce(
                (count, q) => count + (q.userAnswer === q.answer ? 1 : 0),
                0
            )
        },
        result(state) {
            const total = state.questions.length
            const score = state.questions.filter(q => q.userAnswer === q.answer).length
            return {
                score,
                total,
                percentage: total ? Math.round((score / total) * 100) : 0,
            }
        },
    },
    actions: {
        init(settings) {
            const qs = buildQuestions(settings.totalQuestions, settings.lessonRange)
            this.questions = qs.map(q => ({ ...q, userAnswer: null })) // 👈 attach userAnswer
            this.currentIndex = 0
            this.started = true
            this.finished = false
        },
        saveAnswer(answer) {
            if (this.currentQuestion) {
                this.currentQuestion.userAnswer = answer
            }
        },
        next() {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++
            } else {
                this.finished = true
            }
        },
        reset() {
            this.questions = []
            this.currentIndex = 0
            this.started = false
            this.finished = false
        },
    },
})
