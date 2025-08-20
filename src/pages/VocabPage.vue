<template>
    <div class="container py-4">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/" class="btn btn-outline-secondary me-3" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h3 class="mb-0">Vocab Lists ({{ totalItems }})</h3>
            <select id="lesson-select" v-model="selectedLesson" class="form-select d-inline w-auto ms-3">
                <option v-for="n in lessonRange" :key="n" :value="n">
                    Lesson {{ n }}
                </option>
            </select>
        </div>

        <div class="table-responsive" style="max-height: 75vh; overflow-y: auto;">
            <table class="table table-striped table-bordered mb-0">
                <component :is="headerComponent"></component>
                <tbody>
                    <tr v-for="(item, index) in filteredVocabularies" :key="index"
                        :class="{ 'kanji-row': item.pos === 'kanji' }">
                        <td @click="speak(item.kanji)" class="centered fw-bold" style="cursor: pointer;">
                            {{ item.kanji }}
                        </td>

                        <template v-if="item.pos === 'kanji'">
                            <td @click="speak(item.onyomi)" class="centered" style="cursor: pointer;">{{ item.onyomi }}</td>
                            <td @click="speak(item.kunyomi)" class="centered" style="cursor: pointer;">{{ item.kunyomi }}</td>
                        </template>
                        <template v-else>
                            <td colspan="2" @click="speak(item.kana)" class="centered" style="cursor: pointer;">{{ item.kana }}</td>
                        </template>

                        <td class="text-start centered text-capitalize">{{ item.meaning }}</td>
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
import RegularHeader from '@/components/tableHeader/Regular.vue'
import KanjiHeader from '@/components/tableHeader/Kanji.vue'
import BothHeader from '@/components/tableHeader/Both.vue'

const route = useRoute()
const selectedLesson = ref(1)

const lessonRange = computed(() => {
    const set = route.query.set
    if (set === 'book1') return Array.from({ length: 25 }, (_, i) => i + 1)           // 1–25
    if (set === 'book2') return Array.from({ length: 25 }, (_, i) => i + 26)          // 26–50
    if (set === 'book3') return Array.from({ length: 5 }, (_, i) => i + 51)           // 51–55
    if (set === 'book4') return Array.from({ length: 10 }, (_, i) => i + 56)          // 56–65
    if (set === 'book5') return Array.from({ length: 20 }, (_, i) => i + 66)          // 66–85
    return Array.from({ length: 25 }, (_, i) => i + 1)                                // default: 1–25
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

const headerComponent = computed(() => {
    if (selectedLesson.value <= 50) return RegularHeader
    if (selectedLesson.value >= 51 && selectedLesson.value <= 65) return KanjiHeader
    return BothHeader
})
</script>

<style scoped>
::v-deep(.table .kanji-row) {    
  --bs-table-bg: #fffdf5;       /* lighter background */
  --bs-table-striped-bg: #faf3e4;
  --bs-table-hover-bg: #f8f0da;
  --bs-table-border-color: #e8e0c5;
}
</style>