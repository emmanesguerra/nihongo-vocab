export function speak(text: string, voiceName: string = 'Google 日本語') {
    if (!window.speechSynthesis) return

    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = synth.getVoices()
    const selectedVoice = voices.find(v => v.name === voiceName)

    if (selectedVoice) {
        utterance.voice = selectedVoice
    }

    synth.cancel() // cancel any ongoing speech
    synth.speak(utterance)
}