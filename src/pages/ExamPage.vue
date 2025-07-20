<template>
    <div class="container py-4" v-if="currentQuestion">
        <h4 class="mb-3">Question {{ currentIndex + 1 }} of {{ totalQuestions }}</h4>

        <div class="card">
            <h2 class="mb-4 text-center">{{ currentQuestion.meaning }}</h2>

            <div class="row row-cols-2 row-cols-md-3 g-3">
                <div v-for="(choice, i) in currentQuestion.choices" :key="i" class="col d-flex">
                    <button @pointerdown="touchedIndex = i" @pointerup="touchedIndex = null"
                        @click="() => { selectedAnswer = choice; speak(choice) }" :class="[
                            'custom-btn',
                            'w-100',
                            'p-2',
                            'text-wrap',
                            'd-flex',
                            'align-items-center',
                            'justify-content-center',
                            { 'bg-primary text-white': selectedAnswer === choice }
                        ]" style="min-height: 50px">
                        {{ choice }}
                    </button>
                </div>
            </div>

            <div class="mt-4 text-center">
                <button class="btn btn-success btn-lg" :disabled="!selectedAnswer" @click="submitAnswer">
                    Submit Answer
                </button>
            </div>
        </div>
    </div>

    <div class="container py-4" v-else>
        <h3 class="mb-3">Exam Finished <i class="bi bi-check-circle-fill text-success"></i></h3>
        <p class="lead">Your score: <strong>{{ score }} / {{ totalQuestions }}</strong></p>

        <div class="mt-4">
            <h5>Review:</h5>
            <div class="table-responsive">
                <table class="table table-bordered align-middle text-center">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Meaning</th>
                            <th>Your Answer</th>
                            <th>Correct Answer</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(q, i) in questions" :key="i">
                            <td>{{ i + 1 }}</td>
                            <td>{{ q.meaning }}</td>
                            <td @click="speak(q.userAnswer)" :class="q.userAnswer === q.kana ? 'text-success' : 'text-danger'">
                                {{ q.userAnswer }}
                            </td>
                            <td @click="speak(q.kana)">{{ q.kana }}</td>
                            <td>
                                <i v-if="q.userAnswer === q.kana" class="bi bi-check-circle-fill text-success"></i>
                                <i v-else class="bi bi-x-circle-fill text-danger"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <router-link to="/" class="btn btn-secondary mt-4"><i class="bi bi-house-door-fill"></i> Back to
            Home</router-link>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { vocabularies } from '@/data/vocabularies.js'
import { speak } from '@/core/utils/speech'

const quizStore = useQuizStore()

const currentIndex = ref(0)
const score = ref(0)
const questions = ref([])
const touchedIndex = ref(null)
const selectedAnswer = ref(null)

const totalQuestions = computed(() => quizStore.settings.totalQuestions)
const currentQuestion = computed(() => questions.value[currentIndex.value])

onMounted(() => {
    const [start, end] = quizStore.settings.lessonRange
    const filtered = vocabularies.filter(v => v.lesson >= start && v.lesson <= end)

    let selected = shuffle(filtered)

    if (selected.length < totalQuestions.value) {
        const needed = totalQuestions.value - selected.length
        const extras = []

        const pool = filtered.length ? filtered : vocabularies

        while (extras.length < needed) {
            const random = pool[Math.floor(Math.random() * pool.length)]
            extras.push({ ...random })
        }

        selected = [...selected, ...extras]
    }

    selected = shuffle(selected).slice(0, totalQuestions.value)

    questions.value = selected.map(q => {
        let sameTypeChoices = filtered.filter(v => v.kana !== q.kana && v.type === q.type)

        // If not enough same type choices, fill in with random from other types
        if (sameTypeChoices.length < 5) {
            const fallback = filtered.filter(v => v.kana !== q.kana && v.type !== q.type)
            const needed = 5 - sameTypeChoices.length
            const extra = shuffle(fallback).slice(0, needed)
            sameTypeChoices = [...sameTypeChoices, ...extra]
        }

        // Shuffle and pick 5 wrong choices
        const wrongChoices = shuffle(sameTypeChoices).slice(0, 5).map(v => v.kana)
        const allChoices = shuffle([q.kana, ...wrongChoices])

        return {
            ...q,
            choices: allChoices,
            userAnswer: '',
        }
    })
})

function submitAnswer() {
    if (!currentQuestion.value || selectedAnswer.value === null) return

    currentQuestion.value.userAnswer = selectedAnswer.value

    if (selectedAnswer.value === currentQuestion.value.kana) {
        score.value++
    }

    currentIndex.value++
    selectedAnswer.value = null

    if (currentIndex.value >= totalQuestions.value) {
        saveExamResult()
    }
}

function shuffle(array) {
    const result = array.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

function saveExamResult() {
    const result = {
        date: new Date().toISOString(),
        score: score.value,
        total: totalQuestions.value,
        lessonRange: quizStore.settings.lessonRange,
        questions: questions.value.map(q => ({
            meaning: q.meaning,
            correctAnswer: q.kana,
            userAnswer: q.userAnswer,
            choices: q.choices,
        })),
    }

    const existing = JSON.parse(localStorage.getItem('quizHistory') || '[]')

    const updated = [...existing, result].slice(-10)

    localStorage.setItem('quizHistory', JSON.stringify(updated))
}

</script>

<style scoped>
.custom-btn {
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    color: #495057;
    transition: background-color 0.3s, color 0.3s;
    font-size: 1rem;
}

.card {
    padding: 1rem;
}
</style>