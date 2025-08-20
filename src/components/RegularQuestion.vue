<template>
    <div class="card">
        <h2 class="mb-4 text-center">{{ question.entry.meaning }}</h2>

        <div class="row row-cols-2 row-cols-md-3 g-3">
            <div v-for="(choice, i) in question.choices" :key="i" class="col d-flex">
                <button @pointerdown="touchedIndex = i" @pointerup="touchedIndex = null" @click="
                    $emit('select-answer', choice);
                    speak(choice);
                " :class="[
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
                    {{ choice }}
                </button>
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

const props = defineProps({
    question: Object,
    selectedAnswer: String,
    touchedIndex: Number
})

const emits = defineEmits(["select-answer", "submit"])
</script>
