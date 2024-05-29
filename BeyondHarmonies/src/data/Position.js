
import { ftom } from './Midi'

// transformer freq ==> midi et scaller cette note entre 0 et 1
export function scaleFreq(freq){
	return scaleMidi(ftom(freq))
}

// definir un interval valid des notes MIDI
const lowestNote = 12
const highestNote = 118


export function scaleMidi(midi){
	return Math.scale(midi, lowestNote, highestNote, 0, 1)        // scaller midi note entre 0 et 1
}

//verifier si  une frequence est dans l'intervalle defini
export function freqInRange(freq){
	const mid = ftom(freq)
	return lowestNote <= mid && mid <= highestNote
}

// fixer le fontsize et style selon  la taille de fenetre
export function fontStyle(context){
	const height = window.innerHeight
	const fontSize = Math.clamp(height/40, 10, 16)
	context.font = `${fontSize}px sans-serif`
}

