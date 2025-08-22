import { vocabularies } from "../../data/vocabularies"

export function buildQuestions(totalQuestions, lessonRange) {
    const pool = vocabularies.filter(
        (item) => item.lesson >= lessonRange[0] && item.lesson <= lessonRange[1]
    )

    if (pool.length === 0) return [] // no vocabs available

    let questions: typeof pool = []

    // how many full rounds we can distribute equally
    const fullRounds = Math.floor(totalQuestions / pool.length)
    const remainder = totalQuestions % pool.length

    // repeat each vocab entry for the full rounds
    for (let i = 0; i < fullRounds; i++) {
        questions.push(...pool)
    }

    // add extra random picks for the remainder
    const extra = [...pool]
        .sort(() => Math.random() - 0.5)
        .slice(0, remainder)
    questions.push(...extra)

    // shuffle the final question set
    const shuffled = [...questions].sort(() => Math.random() - 0.5)

    // map into quiz format
    return shuffled.map((entry) => {
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

    // Step 1: same POS in current pool (exclude correct one)
    let wrongChoices = pool
        .filter((v) => v.pos === correctPOS && (v.kanji || v.kana) !== correct)
        .map((v) => ({ kanji: v.kanji, kana: v.kana, pos: v.pos }))
        .sort(() => Math.random() - 0.5)
        .slice(0, numberOfChoices - 1);

    // Step 2: calculate how many more we need
    const needed = numberOfChoices - 1 - wrongChoices.length;

    if (needed > 0) {
        // Step 3: pick from full database
        const fullPool = vocabularies
            .filter(
                (v) =>
                    (v.kanji || v.kana) !== correct &&
                    !wrongChoices.some((w) => w.kanji === v.kanji && w.kana === v.kana)
            )
            .map((v) => ({ kanji: v.kanji, kana: v.kana, pos: v.pos }));

        // shuffle fullPool and pick only 'needed' items
        const additional = fullPool.sort(() => Math.random() - 0.5).slice(0, needed);

        wrongChoices = [...wrongChoices, ...additional];
    }

    // Step 4: shuffle final choices including correct
    return [
        ...wrongChoices,
        { kanji: correctItem.kanji, kana: correctItem.kana, pos: correctItem.pos }
    ].sort(() => Math.random() - 0.5);
}
