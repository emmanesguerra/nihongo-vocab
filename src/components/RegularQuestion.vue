<template>
    <div class="card">
        <h5 class="text-muted text-center small">
            Question {{ questionNumber }} of {{ totalQuestions }}
        </h5>
        <h2 class="mb-4 text-center">{{ question.entry.meaning }}</h2>

        <div class="row row-cols-2 row-cols-md-3 g-3">
            <div v-for="(choice, i) in question.choices" :key="i" class="col d-flex">
                <div @pointerdown="touchedIndex = i" @pointerup="touchedIndex = null" @click="
                    $emit('select-answer', choice);
                // speak(choice);
                " :class="[
                    'btn',
                    'btn-light',
                    'border',
                    'w-100',
                    'p-2',
                    'text-wrap',
                    'd-flex',
                    'flex-column',
                    'align-items-center',
                    'justify-content-center',
                    { 'bg-primary text-white': selectedAnswer === choice }
                ]" style="min-height: 50px">
                    <small v-if="choice.kanji" style="font-size: 0.7em;">{{ choice.kana }}</small>
                    <span>{{ choice.kanji || choice.kana }}</span>
                </div>
            </div>
        </div>

        <div class="mt-4 text-center">
            <button class="btn btn-success" :disabled="!selectedAnswer" @click="$emit('submit')">
                Submit Answer
            </button>
        </div>
    </div>
</template>

<script setup>

import { speak } from '@/core/utils/speech'
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
