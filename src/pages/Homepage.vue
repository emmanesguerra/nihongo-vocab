<template>
    <main class="container text-center py-5">
        <h1 class="nwroman">みんなの日本語 I & II</h1>
        <h4 class="mb-4">Vocabulary Practice</h4>

        <!-- Exam Setup Form -->
        <div class="card mx-auto" style="max-width: 450px;">
            <div class="card-body text-start">
                <div class="mb-3">
                    <label class="form-label"><strong>Number of Questions</strong></label>
                    <select v-model="numQuestions" class="form-select">
                        <option v-for="n in [5, 10, 20, 50, 100, 200, 500, 1000, 2000]" :key="n" :value="n">{{ n }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label"><strong>Vocabulary</strong>【1~50】<br />
                        <strong>Kanji</strong>【51~65】<br />
                        <strong>Intro to Kanji (NihonGoal)</strong>【66~85】</label>
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
        <div class="mt-2 d-flex justify-content-center gap-2">
            <router-link to="/history" class="btn btn-outline-secondary w-50">
                <i class="bi bi-clock-history me-1"></i> Past Results
            </router-link>
            <router-link to="/vocab-summary" class="btn btn-outline-secondary w-50">
                <i class="bi bi-journal-bookmark me-1"></i> Vocab Details
            </router-link>
        </div>
        <div class="mt-2 d-flex justify-content-center gap-2">
            <router-link to="/vocab-list?set=book1" class="btn btn-outline-secondary w-50 n5-row">
                <i class="bi bi-journal-bookmark me-1"></i> Lessons 01–25
            </router-link>
            <router-link to="/vocab-list?set=book2" class="btn btn-outline-secondary w-50 n4-row">
                <i class="bi bi-journal-bookmark me-1"></i> Lessons 26–50
            </router-link>
        </div>
        <div class="mt-2 d-flex justify-content-center gap-2">
            <router-link to="/vocab-list?set=book3" class="btn btn-outline-secondary w-50 n5-row">
                <i class="bi bi-journal-bookmark me-1"></i> Kanji 51–55
            </router-link>
            <router-link to="/vocab-list?set=book4" class="btn btn-outline-secondary w-50 n4-row">
                <i class="bi bi-journal-bookmark me-1"></i> Kanji 56–65
            </router-link>
        </div>
        <div class="mt-2 d-flex justify-content-center gap-2">
            <router-link to="/vocab-list?set=book5" class="btn btn-outline-secondary w-50 kanji-row">
                <i class="bi bi-journal-bookmark me-1"></i> Intro To Kanji 66–85
            </router-link>
        </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useExamStore } from '@/stores/examStore'
import { registerVoiceChecker } from '@/core/utils/speech'

onMounted(() => {
    registerVoiceChecker((hasJapanese) => {
        if (!hasJapanese) {
            alert('⚠️ Japanese voice is not available on this device.\nSpeech function may not work properly.\nPlease install Japanese TTS in your device settings.');
        }
    })
})

const router = useRouter()
const quizStore = useQuizStore()
const exam = useExamStore()

const numQuestions = ref(50)
const lessonStart = ref()
const lessonEnd = ref()
const errorMessage = ref('')

function startExam() {
    errorMessage.value = ''
    const maxLesson = 85

    // Validate START lesson
    if (
        lessonStart.value == null ||
        isNaN(lessonStart.value) ||
        lessonStart.value < 1 ||
        lessonStart.value > maxLesson
    ) {
        errorMessage.value = `Please enter a valid START lesson (1–${maxLesson}).`
        return
    }

    // Validate END lesson if provided
    if (
        lessonEnd.value != null &&
        (isNaN(lessonEnd.value) || lessonEnd.value < 1 || lessonEnd.value > maxLesson)
    ) {
        errorMessage.value = `END lesson must be a number between 1 and ${maxLesson}.`
        return
    }

    // Check logical order
    if (lessonEnd.value != null && lessonStart.value > lessonEnd.value) {
        errorMessage.value = 'START lesson must be less than or equal to END lesson.'
        return
    }

    // Determine final range
    const start = lessonStart.value
    const end = lessonEnd.value != null ? lessonEnd.value : start

    quizStore.setSettings(numQuestions.value, [start, end])
    exam.reset()
    router.push('/exam')
}
</script>

<style scoped>
.nwroman {
    font-family: 'NotoSerifJP', Times, serif;
}

.n5-row {
    background-color: #ffe5b4;
}

.n4-row {
    background-color: #d3f9d8;
}

.kanji-row {
    background-color: #f9dad3;
}
</style>