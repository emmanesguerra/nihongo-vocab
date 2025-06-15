<template>
  <div style="padding: 1rem;">

    <!-- Vocabulary Table -->
    <h3>Vocabulary List - 
      <select id="lesson-select" v-model="selectedLesson" style="margin-left: 0.5rem; padding: 4px 8px;">
        <option v-for="n in 50" :key="n" :value="n">Lesson {{ n }}</option>
      </select>
    </h3>
    <table>
      <thead>
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
          <td>{{ item.meaning }}</td>
        </tr>
      </tbody>
    </table>
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

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #000000;
}
</style>
