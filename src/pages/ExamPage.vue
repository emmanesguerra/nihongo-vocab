<template>
    <div class="container py-4" v-if="currentQuestion">
        <h4 class="mb-3">Question {{ currentIndex + 1 }} of {{ totalQuestions }}</h4>

        <div class="card">
            <div class="card-body">
                <p><strong>Meaning:</strong> {{ currentQuestion.meaning }}</p>
                <p><strong>What is the correct kana?</strong></p>

                <div class="d-grid gap-2">
                    <button v-for="(choice, i) in currentQuestion.choices" :key="i" class="btn btn-outline-primary"
                        @click="submitAnswer(choice)">
                        {{ choice }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- ✅ Result Screen -->
    <div class="container py-4" v-else>
        <h3 class="mb-3">Exam Finished ✅</h3>
        <p class="lead">Your score: <strong>{{ score }} / {{ totalQuestions }}</strong></p>

        <div class="mt-4">
            <h5>Review:</h5>
            <div v-for="(q, i) in questions" :key="i" class="card my-2">
                <div class="card-body">
                    <p><strong>Q{{ i + 1 }}. {{ q.meaning }}</strong></p>
                    <p>
                        Your Answer:
                        <span :class="{
                            'text-success': q.userAnswer === q.kana,
                            'text-danger': q.userAnswer !== q.kana,
                        }">
                            {{ q.userAnswer }}
                        </span>
                    </p>
                    <p v-if="q.userAnswer !== q.kana">Correct Answer: <strong>{{ q.kana }}</strong></p>
                </div>
            </div>
        </div>

        <router-link to="/" class="btn btn-secondary mt-4">🏠 Back to Home</router-link>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { vocabularies } from '@/data/vocabularies.js'

const quizStore = useQuizStore()

const currentIndex = ref(0)
const score = ref(0)
const questions = ref([])

const totalQuestions = computed(() => quizStore.settings.totalQuestions)
const currentQuestion = computed(() => questions.value[currentIndex.value])

onMounted(() => {
    const [start, end] = quizStore.settings.lessonRange
    const filtered = vocabularies.filter(v => v.lesson >= start && v.lesson <= end)

    const selected = shuffle(filtered).slice(0, totalQuestions.value)

    questions.value = selected.map(q => {
        const wrongChoices = vocabularies
            .filter(v => v.kana !== q.kana)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(v => v.kana)

        const allChoices = shuffle([q.kana, ...wrongChoices])

        return {
            ...q,
            choices: allChoices,
            userAnswer: '', // we will store the user's selected answer here
        }
    })
})

function submitAnswer(selectedKana) {
    if (!currentQuestion.value) return

    currentQuestion.value.userAnswer = selectedKana
    if (selectedKana === currentQuestion.value.kana) {
        score.value++
    }
    currentIndex.value++
}

function shuffle(array) {
    const result = array.slice()
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}
</script>
