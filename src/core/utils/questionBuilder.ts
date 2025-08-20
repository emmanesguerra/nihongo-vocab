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
    const correct = correctItem.kanji || correctItem.kana;
    const correctPOS = correctItem.pos;
    const numberOfChoices = 6;

    // Same POS, same lesson
    const samePOSPool = pool.filter((item) => item.pos === correctPOS);

    let wrongChoices = samePOSPool
        .map((v) => v.kanji || v.kana)
        .filter((c) => c !== correct);

    // If not enough, add from same POS across ALL lessons
    if (wrongChoices.length < numberOfChoices - 1) {
        const additional = pool
            .filter((item) => item.pos === correctPOS)
            .map((v) => v.kanji || v.kana)
            .filter((c) => c !== correct && !wrongChoices.includes(c));

        wrongChoices = [...wrongChoices, ...additional];
    }

    // If still not enough, fill with random from entire pool (different POS allowed)
    if (wrongChoices.length < numberOfChoices - 1) {
        const additional = pool
            .map((v) => v.kanji || v.kana)
            .filter((c) => c !== correct && !wrongChoices.includes(c));

        wrongChoices = [...wrongChoices, ...additional];
    }

    // Finally, select the required number of wrong choices
    const selected = wrongChoices
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfChoices - 1);

    // Shuffle again with the correct answer included
    return [...selected, correct].sort(() => Math.random() - 0.5);
}
