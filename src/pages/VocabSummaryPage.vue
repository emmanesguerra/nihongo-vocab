<template>
    <div class="container py-4">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/" class="btn btn-outline-secondary me-3" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h3 class="mb-0">Vocabulary Details</h3>
        </div>

        <!-- Total Count Card -->
        <div class="mb-4">
            <div class="card shadow-sm">
                <div class="card-body text-center">
                    <h5 class="mb-2">Total Vocabulary</h5>
                    <span class="display-6">{{ filteredVocabularies.length }}</span>
                </div>
            </div>
        </div>

        <!-- Type Counts Table -->
        <div class="mb-4">
            <h5>By Type</h5>
            <table class="table table-bordered table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Type</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(count, type) in typeCounts" :key="type">
                        <td>{{ type.toUpperCase() }}</td>
                        <td>{{ count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Lesson Counts Table -->
        <div>
            <h5>By Lesson</h5>
            <table class="table table-bordered table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Lesson</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(count, lesson) in lessonCounts" :key="lesson">
                        <td>Lesson {{ lesson }}</td>
                        <td>{{ count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { vocabularies } from '@/data/vocabularies.js'

const route = useRoute()

const filteredVocabularies = computed(() => {
    const set = route.query.set
    if (!set) return vocabularies
    return vocabularies.filter(v => v.set === set)
})

const typeCounts = computed(() => {
    const counts = {}
    for (const item of filteredVocabularies.value) {
        const type = item.type || 'Unknown'
        counts[type] = (counts[type] || 0) + 1
    }
    return counts
})

const lessonCounts = computed(() => {
    const counts = {}
    for (const item of filteredVocabularies.value) {
        const lesson = item.lesson || 'Unknown'
        counts[lesson] = (counts[lesson] || 0) + 1
    }
    return counts
})
</script>
