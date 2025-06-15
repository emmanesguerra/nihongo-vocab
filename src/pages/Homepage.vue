<template>
    <main class="container text-center py-5">
        <h1>Minna no Nihongo I & II</h1>
        <h4 class="mb-4">Vocabulary Practice</h4>

        <!-- Exam Setup Form -->
        <div class="card mx-auto" style="max-width: 500px;">
            <div class="card-body text-start">
                <div class="mb-3">
                    <label class="form-label">Number of Questions</label>
                    <select v-model="numQuestions" class="form-select">
                        <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Lesson Range (1~50)</label>
                    <div class="d-flex gap-2">
                        <input type="number" v-model.number="lessonStart" class="form-control" min="1" max="50"
                            placeholder="Start">
                        <input type="number" v-model.number="lessonEnd" class="form-control" min="1" max="50"
                            placeholder="End">
                    </div>
                </div>

                <div class="mt-4 text-center">
                    <p v-if="errorMessage" class="text-danger text-center mb-3">{{ errorMessage }}</p>
                    <button class="btn btn-primary" @click="startExam">
                        <i class="bi bi-play-fill me-2"></i> Start Practice
                    </button>
                </div>
            </div>
        </div>

        <!-- View Vocabulary Button -->
        <div class="mt-4 d-flex justify-content-center gap-3">
            <router-link to="/history" class="btn btn-outline-secondary">
                <i class="bi bi-clock-history me-1"></i> Past Results
            </router-link>
            <router-link to="/vocab" class="btn btn-outline-secondary">
                <i class="bi bi-journal-bookmark-fill me-1"></i> View Vocabulary
            </router-link>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useQuizStore } from '@/stores/quizStore'

const router = useRouter()
const quizStore = useQuizStore()

const numQuestions = ref(10)
const lessonStart = ref()
const lessonEnd = ref()
const errorMessage = ref('')

function startExam() {
    errorMessage.value = ''

    // Validation checks
    if (
        lessonStart.value === undefined ||
        lessonEnd.value === undefined ||
        isNaN(lessonStart.value) ||
        isNaN(lessonEnd.value) ||
        lessonStart.value < 1 ||
        lessonEnd.value > 50 ||
        lessonStart.value > lessonEnd.value
    ) {
        errorMessage.value = 'Please enter a valid range (1–50) where start ≤ end.'
        return
    }

    quizStore.setSettings(numQuestions.value, [lessonStart.value, lessonEnd.value])
    router.push('/exam')
}
</script>
