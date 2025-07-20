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
                        <option v-for="n in [10, 20, 50, 100, 200, 500, 1000, 2000]" :key="n" :value="n">{{ n }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Lesson Range (1~50)</label>
                    <div class="d-flex gap-2">
                        <input type="number" v-model.number="lessonStart" class="form-control" min="1" max="50"
                            placeholder="Start">
                        <input type="number" v-model.number="lessonEnd" class="form-control" min="1" max="50"
                            placeholder="End (optional)">
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
            <router-link to="/vocab-summary" class="btn btn-outline-secondary">
                <i class="bi bi-journal-bookmark me-1"></i> Vocab Details
            </router-link>
            <router-link to="/vocab?set=book1" class="btn btn-outline-secondary">
                <i class="bi bi-journal-bookmark me-1"></i> Lesson 1–25
            </router-link>
            <router-link to="/vocab?set=book2" class="btn btn-outline-secondary">
                <i class="bi bi-journal-bookmark me-1"></i> Lesson 26–50
            </router-link>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted  } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { registerVoiceChecker  } from '@/core/utils/speech'

onMounted(() => {
    registerVoiceChecker((hasJapanese) => {
        if (!hasJapanese) {
            alert('⚠️ Japanese voice is not available on this device.\nSpeech function may not work properly.\nPlease install Japanese TTS in your device settings.');
        }
    })
})

const router = useRouter()
const quizStore = useQuizStore()

const numQuestions = ref(10)
const lessonStart = ref()
const lessonEnd = ref()
const errorMessage = ref('')

function startExam() {
    errorMessage.value = ''

    // Basic check: Start must be valid
    if (
        lessonStart.value === undefined ||
        isNaN(lessonStart.value) ||
        lessonStart.value < 1 ||
        lessonStart.value > 50
    ) {
        errorMessage.value = 'Please enter a valid START lesson (1–50).'
        return
    }

    // If End is filled, validate it too
    if (
        lessonEnd.value !== undefined &&
        lessonEnd.value !== null &&
        (
            isNaN(lessonEnd.value) ||
            lessonEnd.value < 1 ||
            lessonEnd.value > 50
        )
    ) {
        errorMessage.value = 'END lesson must be a number between 1 and 50.'
        return
    }

    // If both Start and End are given, check order
    if (
        lessonEnd.value !== undefined &&
        lessonEnd.value !== null &&
        lessonStart.value > lessonEnd.value
    ) {
        errorMessage.value = 'START lesson must be less than or equal to END lesson.'
        return
    }

    // Determine final range
    const start = lessonStart.value
    const end = (lessonEnd.value !== undefined && lessonEnd.value !== null) ? lessonEnd.value : start

    quizStore.setSettings(numQuestions.value, [start, end])
    router.push('/exam')
}
</script>
