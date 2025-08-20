<template>
    <main class="container text-center py-5">
        <!-- Exam in progress -->
        <div v-if="!exam.finished && exam.currentQuestion" class="question-box">

            <component :is="exam.currentQuestion.entry.type === 'kanji' ? KanjiQuestion : RegularQuestion"
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
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useExamStore } from '@/stores/examStore'
import Result from "@/components/Result.vue"
import RegularQuestion from "@/components/RegularQuestion.vue"
import KanjiQuestion from "@/components/KanjiQuestion.vue"
import { onBeforeRouteLeave } from 'vue-router'

const quizStore = useQuizStore()
const exam = useExamStore()

onMounted(() => {
    if (!exam.started) {
        exam.init(quizStore.settings)
    }

    // Warn on refresh / close
    window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
})

// Warn on browser refresh or tab close
function handleBeforeUnload(event) {
    if (!exam.finished) {
        event.preventDefault()
        event.returnValue = ''
    }
}

// Warn on route change only for this page
onBeforeRouteLeave((to, from, next) => {
    if (!exam.finished) {
        const answer = confirm(
            "Leaving this page will reset the exam. Are you sure?"
        )
        if (answer) {
            next()
        } else {
            next(false)
        }
    } else {
        next()
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
