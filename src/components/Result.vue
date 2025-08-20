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
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Meaning</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(q, index) in examStore.questions" :key="index"
                        :class="q.userAnswer === q.answer ? 'table-success' : 'table-danger'">
                        <td>{{ index + 1 }}</td>
                        <td>{{ q.entry.meaning }}</td>
                        <td>{{ q.userAnswer ?? '—' }}</td>
                        <td>{{ q.answer }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Back Button -->
        <div class="mt-4">
            <router-link to="/" class="btn btn-secondary">
                ⬅ Back to Home
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useExamStore } from '@/stores/examStore'
import { useQuizStore } from '@/stores/quizStore'

const quizStore = useQuizStore()
const examStore = useExamStore()

const correctCount = computed(() =>
    examStore.questions.filter(q => q.userAnswer === q.answer).length
)

const lessonLabel = computed(() => {
    const [start, end] = quizStore.settings.lessonRange
    return start === end ? `Lesson ${start}` : `Lessons ${start} - ${end}`
})
</script>
