<template>
    <div class="container p-3">
        <h2 class="mb-4"><i class="bi bi-journal-bookmark-fill me-1"></i> Practice Results</h2>

        <div v-if="history.length">
            <div v-for="(entry, index) in history" :key="index" class="card mb-4 p-1 w-100 mx-auto"
                :class="['w-100', 'p-1', 'mb-4', 'mx-auto', 'card', 'w-100', 'w-md-75', 'w-lg-50']">
                <div class="card-body">
                    <h5 class="card-title">{{ formatDate(entry.date) }}</h5>
                    <p><strong>Score:</strong> {{ entry.score }} / {{ entry.total }}</p>
                    <p><strong>Lesson Range:</strong> Lesson {{ entry.lessonRange[0] }} to {{ entry.lessonRange[1] }}
                    </p>

                    <details>
                        <summary class="d-flex justify-content-between align-items-center custom-summary">
                            <span><i class="bi bi-search me-1"></i> Review Questions</span>
                            <i class="bi bi-chevron-down toggle-icon ms-2"></i>
                        </summary>
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
                                        <td @click="speak(q.userAnswer)" :class="q.userAnswer === q.correctAnswer ? 'text-success' : 'text-danger'">
                                            {{ q.userAnswer }}
                                        </td>
                                        <td @click="speak(q.correctAnswer)">{{ q.correctAnswer }}</td>
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
import { speak } from '@/core/utils/speech'

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

<style scoped>
.custom-summary {
    list-style: none;
    /* Removes default marker */
    cursor: pointer;
    padding: 0.5rem 0;
}

.custom-summary::-webkit-details-marker {
    display: none;
    /* Hides default arrow in Chrome/Safari */
}

details[open] .toggle-icon {
    transform: rotate(180deg);
    transition: transform 0.3s;
}

.toggle-icon {
    transition: transform 0.3s;
}

</style>