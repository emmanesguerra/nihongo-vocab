<template>
    <main class="container text-center py-5">
        <!-- Exam in progress -->
        <div v-if="!exam.finished && exam.currentQuestion" class="question-box">

            <component :is="exam.currentQuestion.entry.pos === 'kanji' ? KanjiQuestion : RegularQuestion"
                :question="exam.currentQuestion" :selected-answer="selectedAnswer" @select-answer="selectAnswer"
                @submit="handleNext" />

        </div>

        <!-- Results -->
        <div v-else class="result-box">
            <Result />
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useExamStore } from '@/stores/examStore'
import Result from "@/components/Result.vue"
import RegularQuestion from "@/components/RegularQuestion.vue"
import KanjiQuestion from "@/components/KanjiQuestion.vue"

const quizStore = useQuizStore()
const exam = useExamStore()

onMounted(() => {
    if (!exam.started) {
        exam.init(quizStore.settings)
    }
})

const selectedAnswer = computed({
    get: () => exam.currentQuestion?.userAnswer || null,
    set: (val) => exam.saveAnswer(val),
})

function selectAnswer(choice) {
    selectedAnswer.value = choice
}

function handleNext() {
    if (exam.isLast) {
        exam.finished = true
    } else {
        exam.next()
    }
}
</script>
