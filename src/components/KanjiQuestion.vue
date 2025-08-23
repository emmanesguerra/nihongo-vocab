<template>
    <div class="card">
        <h5 class="text-muted text-center small">
            Question {{ questionNumber }} of {{ totalQuestions }}
        </h5>
        <p class="text-center">Meaning: {{ question.entry.meaning  }}<br />
            Onyomi: {{ question.entry.onyomi }}<br />
            Kunyomi: {{ question.entry.kunyomi }}</p>

        <div class="row row-cols-2 row-cols-md-3 g-3 mt-3">
            <div v-for="(choice, i) in question.choices" :key="i" class="col d-flex">
                <button @pointerdown="touchedIndex = i" @pointerup="touchedIndex = null"
                    @click="$emit('select-answer', choice)" :class="[
                        'btn',
                        'btn-light',
                        'border',
                        'w-100',
                        'p-2',
                        'text-wrap',
                        'd-flex',
                        'align-items-center',
                        'justify-content-center',
                        { 'bg-primary text-white': selectedAnswer === choice }
                    ]" style="min-height: 50px">
                    {{ choice.kanji }}
                </button>
            </div>
        </div>

        <div class="mt-4 text-center">
            <button class="btn btn-success btn-lg" :disabled="!selectedAnswer" @click="$emit('submit')">
                Submit Answer
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue' 

const props = defineProps({
    question: Object,
    selectedAnswer: {
        type: Object,
        default: () => null
    },
    questionNumber: Number,
    totalQuestions: Number
})

const emits = defineEmits(["select-answer", "submit"])

const touchedIndex = ref(null)
</script>
