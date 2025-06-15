<template>
    <div class="container py-5">
        <h2 class="mb-4"><i class="bi bi-journal-bookmark-fill me-1"></i> Practice Results</h2>

        <div v-if="history.length">
            <div v-for="(entry, index) in history" :key="index" class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">{{ formatDate(entry.date) }}</h5>
                    <p><strong>Score:</strong> {{ entry.score }} / {{ entry.total }}</p>
                    <p><strong>Lesson Range:</strong> Lesson {{ entry.lessonRange[0] }} to {{ entry.lessonRange[1] }}
                    </p>

                    <details>
                        <summary><i class="bi bi-search me-1"></i> Review Questions</summary>
                        <div class="table-responsive mt-3">
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
                                    <tr v-for="(q, i) in entry.questions" :key="i">
                                        <td>{{ i + 1 }}</td>
                                        <td>{{ q.meaning }}</td>
                                        <td :class="q.userAnswer === q.correctAnswer ? 'text-success' : 'text-danger'">
                                            {{ q.userAnswer }}
                                        </td>
                                        <td>{{ q.correctAnswer }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            </div>
        </div>

        <div v-else class="alert alert-info text-center">
            No history available yet.
        </div>

        <div class="text-center mt-4">
            <router-link to="/" class="btn btn-primary"><i class="bi bi-house-door-fill"></i> Back to Home</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const history = ref([])

onMounted(() => {
    try {
        const raw = localStorage.getItem('quizHistory')
        const parsed = JSON.parse(raw)

        if (Array.isArray(parsed)) {
            history.value = parsed.reverse()
        } else {
            console.warn('quizHistory is not an array')
        }
    } catch (err) {
        console.error('Error loading history:', err)
    }
})

function formatDate(isoString) {
    const date = new Date(isoString)
    return date.toLocaleString()
}
</script>
