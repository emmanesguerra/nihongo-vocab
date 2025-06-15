<template>
    <div class="container py-4">
        <div class="mb-4">
            <h3 class="d-inline">Vocabulary List -</h3>
            <select id="lesson-select" v-model="selectedLesson" class="form-select d-inline w-auto ms-2">
                <option v-for="n in 50" :key="n" :value="n">Lesson {{ n }}</option>
            </select>
        </div>

        <div class="table-responsive" style="max-height: 85vh; overflow-y: auto;">
            <table class="table table-striped table-bordered mb-0">
                <thead class="table-dark sticky-top">
                    <tr>
                        <th>Kanji</th>
                        <th>Kana</th>
                        <th>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredVocabularies" :key="index">
                        <td>{{ item.kanji }}</td>
                        <td>{{ item.kana }}</td>
                        <td class="text-start">{{ item.meaning }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { vocabularies } from '@/data/vocabularies.js'

const selectedLesson = ref(1)

const filteredVocabularies = computed(() =>
    vocabularies.filter(v => v.lesson === selectedLesson.value)
)
</script>
