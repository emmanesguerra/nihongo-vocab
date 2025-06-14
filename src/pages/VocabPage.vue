<script setup lang="ts">
import { vocabLesson1 } from '@/data/lessons.js'
</script>

<template>
  <div style="padding: 1rem;">
    <h2>Lesson 1 Vocabulary</h2>
    <table>
      <thead>
        <tr>
          <th>Word</th>
          <th>Kana</th>
          <th>Kanji</th>
          <th>Meaning</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in vocabLesson1" :key="index">
          <td>{{ item.word }}</td>
          <td>{{ item.kana }}</td>
          <td>{{ item.kanji }}</td>
          <td>{{ item.meaning }}</td>
          <td>{{ item.type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

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
  background-color: #f5f5f5;
}
</style>
