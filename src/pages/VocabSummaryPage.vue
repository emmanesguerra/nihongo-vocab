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
                        <th>Level</th>
                        <th>Lesson</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(count, lesson) in lessonCounts" :key="lesson" :class="getLevelClass(lesson)">
                        <td>{{ getLessonLevel(lesson) }}</td>
                        <td>Lesson {{ lesson }}</td>
                        <td>{{ count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="text-center mt-4">
            <router-link to="/" class="btn btn-primary"><i class="bi bi-house-door-fill"></i> Back to Home</router-link>
        </div>
    </div>
</template>


<script setup lang="ts">

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
const getLessonLevel = (lesson) => {
    const num = Number(lesson)

    if (num >= 1 && num <= 25) return 'N5'
    if (num >= 26 && num <= 50) return 'N4'
    if (num >= 51 && num <= 55) return 'N5 Kanji'
    if (num >= 56 && num <= 65) return 'N4 Kanji'

    return 'Unknown'
}

const getLevelClass = (lesson: number) => {
  if (lesson >= 1 && lesson <= 25) return 'n5-row';
  if (lesson >= 26 && lesson <= 50) return 'n4-row';
  if (lesson >= 51 && lesson <= 55) return 'n5-row'; // N5 Kanji
  if (lesson >= 56 && lesson <= 65) return 'n4-row'; // N4 Kanji
  return '';
};

</script>

<style scoped>
.n5-row {
  background-color: #ffe5b4; 
}

.n4-row {
  background-color: #d3f9d8;
}
</style>