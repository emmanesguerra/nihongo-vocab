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
                    <label class="form-label">Lesson Range</label>
                    <div class="d-flex gap-2">
                        <input type="number" v-model.number="lessonStart" class="form-control" min="1" max="50"
                            placeholder="Start">
                        <input type="number" v-model.number="lessonEnd" class="form-control" min="1" max="50"
                            placeholder="End">
                    </div>
                </div>

                <div class="d-grid mt-4">
                    <button class="btn btn-primary" @click="startExam">
                        🚀 Start Practice
                    </button>
                </div>
            </div>
        </div>

        <!-- View Vocabulary Button -->
        <div class="mt-4 d-flex justify-content-center gap-3">
            <router-link to="/history" class="btn btn-outline-secondary">
                🕘 Past Results
            </router-link>
            <router-link to="/vocab" class="btn btn-outline-secondary">
                📚 View Vocabulary
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

function startExam() {
    quizStore.setSettings(numQuestions.value, [lessonStart.value, lessonEnd.value])
    router.push('/exam')
}
</script>
