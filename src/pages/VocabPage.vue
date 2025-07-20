<template>
    <div class="container py-4">
        <div class="mb-4 d-flex align-items-center">
            <router-link to="/" class="btn btn-outline-secondary me-3" title="Back to Home">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h3 class="mb-0">Vocabs Lists ({{ totalItems }}) </h3>
            <select id="lesson-select" v-model="selectedLesson" class="form-select d-inline w-auto ms-3">
                <option v-for="n in 50" :key="n" :value="n">Lesson {{ n }}</option>
            </select>
        </div>

        <div class="table-responsive" style="max-height: 75vh; overflow-y: auto;">
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
                        <td @click="speak(item.kana)" style="cursor: pointer;" class="text-primary">{{ item.kana }}</td>
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
const totalItems = computed(() => filteredVocabularies.value.length)
const totalAllVocabularies = computed(() => vocabularies.length)

const filteredVocabularies = computed(() =>
    vocabularies.filter(v => v.lesson === selectedLesson.value)
)

function speak(text) {
    if (!window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
}
</script>
