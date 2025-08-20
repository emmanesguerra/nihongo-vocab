import { vocabularies } from "../../data/vocabularies"

export function buildQuestions(totalQuestions, lessonRange) {
    const pool = vocabularies.filter(
        (item) => item.lesson >= lessonRange[0] && item.lesson <= lessonRange[1]
    )

    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    return shuffled.slice(0, totalQuestions).map((entry) => {
        const correctChoice = entry.kanji || entry.kana

        return {
            entry: entry,
            answer: correctChoice,
            choices: generateChoices(pool, entry),
        }
    })
}

function generateChoices(pool, correctItem) {

    const correct = correctItem.kanji || correctItem.kana
    const correctPOS = correctItem.pos
    const numberOfChoices = 6

    const samePOSPool = pool.filter((item) => item.pos === correctPOS)

    const wrongChoices = samePOSPool
        .map((v) => v.kanji || v.kana)
        .filter((c) => c !== correct)

    const selected = wrongChoices
        .sort(() => Math.random() - 0.5)
        .slice(0, (numberOfChoices - 1))

    return [...selected, correct].sort(() => Math.random() - 0.5)
}
