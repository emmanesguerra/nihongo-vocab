<template>
    <div class="container py-3">
        <div class="mb-2 d-flex align-items-center">
            <router-link to="/" class="btn btn-outline-secondary me-3" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <select id="lesson-select" v-model="selectedLesson" class="form-select d-inline w-auto">
                <option v-for="n in lessonRange" :key="n" :value="n">
                    Lesson {{ n }}
                </option>
            </select>
        </div>
        <div class="mb-2 d-flex align-items-center">
            <input type="text" v-model="searchQuery" class="form-control w-auto" placeholder="Search..." />
            <p v-if="searchQuery" class="small m-3">
                Find {{ filteredVocabularies.length }} Items
            </p>
        </div>

        <div class="table-responsive" style="max-height: 75vh; overflow-y: auto;">
            <table class="table table-striped table-bordered mb-0">
                <component :is="headerComponent"></component>
                <tbody>
                    <tr v-for="(item, index) in filteredVocabularies" :key="index"
                        :class="{ 'kanji-row': item.pos === 'kanji' }">
                        <td class="centered text-capitalize">{{ searchQuery ? "L" + item.lesson : (index + 1) }}</td>
                        <td @click="speak(item.pos === 'kanji' ? item.kanji : item.kana)" class="centered fw-bold"
                            style="cursor: pointer;">
                            {{ item.kanji }}
                        </td>

                        <template v-if="item.pos === 'kanji'">
                            <td @click="speak(item.onyomi)" class="centered" style="cursor: pointer;">{{ item.onyomi }}
                            </td>
                            <td @click="speak(item.kunyomi)" class="centered" style="cursor: pointer;">{{ item.kunyomi
                            }}</td>
                        </template>
                        <template v-else>
                            <td colspan="2" @click="speak(item.kana)" class="centered" style="cursor: pointer;">{{
                                item.kana }}</td>
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
const searchQuery = ref("")

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
    // if no search, only show selected lesson
    if (!searchQuery.value.trim()) {
        return vocabularies.filter(v => v.lesson === selectedLesson.value)
    }

    // if searching, search ALL lessons
    const query = searchQuery.value.toLowerCase()
    return vocabularies.filter(v => {
        return (
            (v.kanji && v.kanji.includes(query)) ||
            (v.kana && v.kana.includes(query)) ||
            (v.meaning && v.meaning.toLowerCase().includes(query)) ||
            (v.onyomi && v.onyomi.includes(query)) ||
            (v.kunyomi && v.kunyomi.includes(query))
        )
    })
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
    --bs-table-bg: #fffdf5;
    /* lighter background */
    --bs-table-striped-bg: #faf3e4;
    --bs-table-hover-bg: #f8f0da;
    --bs-table-border-color: #e8e0c5;
}
</style>