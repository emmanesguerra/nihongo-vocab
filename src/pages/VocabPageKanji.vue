<template>
    <div class="container py-4">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/" class="btn btn-outline-secondary me-3" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h3 class="mb-0">Kanji Lists ({{ totalItems }})</h3>
            <select id="lesson-select" v-model="selectedLesson" class="form-select d-inline w-auto ms-3">
                <option v-for="n in lessonRange" :key="n" :value="n">
                    Lesson {{ n }}
                </option>
            </select>
        </div>

        <div class="table-responsive" style="max-height: 75vh; overflow-y: auto;">
            <table class="table table-striped table-bordered mb-0">
                <thead class="table-dark sticky-top">
                    <tr>
                        <th>Kanji</th>
                        <th>Onyomi</th>
                        <th>Kunyomi</th>
                        <th>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredVocabularies" :key="index">
                        <td @click="speak(item.kanji)" class="fw-bold fs-5" style="cursor: pointer;" >{{ item.kanji }}</td>
                        <td @click="speak(item.onyomi)">{{ item.onyomi }}</td>
                        <td @click="speak(item.kunyomi)">{{ item.kunyomi }}</td>
                        <td class="text-start">{{ item.meaning }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { vocabularies } from '@/data/vocabularies.js'
import { speak } from '@/core/utils/speech'

const route = useRoute()
const selectedLesson = ref(1)

const lessonRange = computed(() => {
    const set = route.query.set
    if (set === 'book1') return Array.from({ length: 5 }, (_, i) => i + 51) // 51–55
    if (set === 'book2') return Array.from({ length: 10 }, (_, i) => i + 56) // 56–65
    return Array.from({ length: 15 }, (_, i) => i + 51) // default: full range 51–65
})

// Watch for route query changes and auto-adjust selected lesson
watch(
    () => route.query.set,
    (set) => {
        const range = lessonRange.value
        if (!range.includes(selectedLesson.value)) {
            selectedLesson.value = range[0]
        }
    },
    { immediate: true }
)

// Filter vocabularies by selected lesson
const filteredVocabularies = computed(() => {
    return vocabularies.filter(v => v.lesson === selectedLesson.value)
})

const totalItems = computed(() => filteredVocabularies.value.length)
</script>
