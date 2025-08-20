<template>
    <div class="exam">
        <div v-if="exam.currentQuestion" class="question-box">
            <p class="question">
                {{ exam.progress.index }}. {{ exam.currentQuestion.question }}
            </p>

            <ul class="choices">
                <li v-for="(choice, i) in exam.currentQuestion.choices" :key="i" class="choice">
                    <button type="button" :class="{ selected: selectedAnswer === choice }"
                        @click="selectAnswer(choice)">
                        {{ choice }}
                    </button>
                </li>
            </ul>

            <div class="nav-buttons">
                <button @click="handleNext" :disabled="!selectedAnswer">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useQuizStore } from '@/stores/quizStore'
import { useExamStore } from '@/stores/examStore'

const quizStore = useQuizStore()
const exam = useExamStore()

onMounted(() => {
    if (!exam.started) {
        exam.init(quizStore.settings)
    }
})

const selectedAnswer = computed({
    get: () => exam.answers[exam.currentIndex] || null,
    set: (val) => exam.saveAnswer(exam.currentIndex, val),
})

function selectAnswer(choice) {
    selectedAnswer.value = choice
}

function handleNext() {
    if (exam.isLast) {
        alert('Exam finished!')
        console.log('Answers:', exam.answers)
    } else {
        exam.next()
    }
}
</script>

<style scoped>
.exam {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: sans-serif;
}

.question-box {
    max-width: 600px;
    width: 100%;
    padding: 20px;
    border: 2px solid #333;
    border-radius: 10px;
    background: #f9f9f9;
    text-align: center;
}

.question {
    margin-bottom: 20px;
    font-size: 18px;
}

.choices {
    list-style: none;
    padding: 0;
    margin: 0 0 20px 0;
}

.choice {
    margin: 10px 0;
}

.choice button {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #2b2a2a;
    background: #2b2a2a;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.choice button.selected {
    background: #0084ff;
}

.choice button:hover {
    background: #444;
}

.nav-buttons {
    display: flex;
    justify-content: center;
}
</style>
