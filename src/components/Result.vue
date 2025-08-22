<template>
    <div class="card">
        <h2 class="mb-4">Result</h2>

        <!-- Quiz Info -->
        <p><strong>Total Questions:</strong> {{ quizStore.settings.totalQuestions }} <br />
            <strong>Lessons:</strong> {{ lessonLabel }} <br />
            <strong>Correct:</strong> {{ correctCount }} / {{ examStore.questions.length }}
        </p>

        <!-- Table -->
        <div class="table-responsive mt-4">
            <table class="table table-bordered align-middle">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Meaning</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(q, i) in examStore.questions" :key="i">
                        <td>{{ i + 1 }}</td>
                        <td>{{ q.entry.meaning }}</td>
                        <td @click="speak(q.userAnswer.pos === 'kanji' ? q.userAnswer.kanji : q.userAnswer.kana)"
                            :class="(q.userAnswer.kanji || q.userAnswer.kana)  === q.answer ? 'text-success' : 'text-danger'">
                            {{ q.userAnswer.kanji || q.userAnswer.kana }}
                        </td>
                        <td @click="speak(q.entry.pos === 'kanji' ? q.entry.kanji : q.entry.kana)">
                            {{ q.answer }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Back Button -->
        <div class="mt-4">
            <router-link to="/" class="btn btn-secondary">
                <i class="bi bi-house-door-fill"></i> Back to Home
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useExamStore } from '@/stores/examStore'
import { useQuizStore } from '@/stores/quizStore'
import { speak } from '@/core/utils/speech'

const quizStore = useQuizStore()
const examStore = useExamStore()

const correctCount = computed(() =>
    examStore.questions.filter(q => (q.userAnswer.kanji || q.userAnswer.kana)  === q.answer).length
)

const lessonLabel = computed(() => {
    const [start, end] = quizStore.settings.lessonRange
    return start === end ? `Lesson ${start}` : `Lessons ${start} - ${end}`
})
</script>
