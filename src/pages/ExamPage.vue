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
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
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

watch(() => exam.finished, (finished) => {
    if (finished) saveExamResult()
})

function saveExamResult() {
    const correctCount = exam.questions.filter(q => (q.userAnswer.kanji || q.userAnswer.kana)  === q.answer).length

    const result = {
        date: new Date().toISOString(),
        score: correctCount,
        total: quizStore.settings.totalQuestions,
        lessonRange: quizStore.settings.lessonRange,
        questions: exam.questions.map(q => ({
            meaning: q.entry.meaning,
            correctAnswer: q.answer,
            userAnswer: q.userAnswer,
            choices: q.choices,
            type: q.entry.pos,
            kanji: q.entry.kanji,
            kana: q.entry.kana,
        })),
    }

    const existing = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    const updated = [...existing, result].slice(-10) // only keep latest 10
    localStorage.setItem('quizHistory', JSON.stringify(updated))
}
</script>
