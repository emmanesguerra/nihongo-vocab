// src/core/utils/speech.ts

export function speak(text: string, voiceName: string = 'Google 日本語') {
    if (!window.speechSynthesis) return

    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const selectedVoice = voices.find(v => v.name === voiceName)

    if (selectedVoice) {
        utterance.voice = selectedVoice
    }

    synth.cancel()
    synth.speak(utterance)
}

export function isJapaneseVoiceAvailable(): boolean {
    if (!window.speechSynthesis) return false
    const voices = window.speechSynthesis.getVoices()
    return voices.some(v => v.lang.startsWith('ja') || v.name.includes('日本語'))
}

// Call this in homepage
export function registerVoiceChecker(callback: (hasJapanese: boolean) => void) {
    const check = () => {
        const available = isJapaneseVoiceAvailable()
        callback(available)
    }

    if (speechSynthesis.getVoices().length > 0) {
        check()
    } else {
        // wait for voiceschanged
        speechSynthesis.addEventListener('voiceschanged', check)
    }
}
