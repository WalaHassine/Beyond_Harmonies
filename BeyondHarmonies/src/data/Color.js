import chroma from 'chroma-js'
import { Frequency } from 'tone'

export function ftom(freq){
	return 69 + 12 * Math.log2(freq / 440)
}

const frequencyColors = [
	'#e33059',
	'#f75839',
	'#f7943d',
	'#f3b72f',
	'#edd929',
	'#95c631',
	'#47ad4b',
	'#45b5a1',
	'#42acb0',
	'#4e61d8',
	'#9013fe',
	'#bd10e0',
].map(c => chroma(c))


const jayColors = [
	'#00FFFF',
	'#FF8000',
	'#FFFF00',
	'#FF337F',
	'#FFFFAA',
	'#009966',
	'#FF0000',
	'#80FF00',
	'#FF00FF',
	'#009999',
	'#9900FF',
	'#007FFF'
].map(c => chroma(c))


const ampColors = [
	'#000000',
	'#56a754',
	'#edd929',
	'#e33059',
].map(c => chroma(c))

const ampColorsWhite = ampColors.slice()   // creation d'une copie de tab amp_colors
ampColorsWhite[0] = chroma('#ffffff')       // ajouter le blanc au debut de la liste des couleurs (remplacer le noir par le blanc)

// color mode par defaut 
let colorMode = 'rainbow'

if (window.location.hash.includes('jay')){
	colorMode = 'jay'
}

window.addEventListener('hashchange', () => {
	if (window.location.hash.includes('jay')){
		colorMode = 'jay'		
	}
})

export function setColorMode(mode){
	colorMode = mode
}



export function midi2Color(midi){

	const colorArr = colorMode === 'rainbow' ? frequencyColors : jayColors
	return colorArr[midi % colorArr.length]
}

export function note2Color(note){
	return midi2Color(Frequency(note).toMidi())
}

export function freq2Color(freq){
	if (freq === -1){
		return 'white'
	} else {
		
		const fMidi = ftom(freq)            //convertir frequence en valeur MIDI
		const m0 = Math.floor(fMidi)        // calculer valeur MIDI entière inf (m0)
		const m1 = Math.ceil(fMidi)          //calculer valeur MIDI entière sup (m1)
		const percent = fMidi - m0           //calculer la pourcentage distance(m0 et m1)
		return chroma.mix(midi2Color(m0).hex(), midi2Color(m1).hex(), percent)                //mixer les couleurs de m0 et m1 selon le pourcentage
	}
}

export function amp2Color(amp, noBlack = false, exp=0.7){
	const index = Math.scale(Math.clamp(Math.pow(amp, exp), 0, 1), 0, 1, 0, ampColors.length - 1)    //calcul de l'index de couleur 
	const a0 = Math.floor(index)             // arrondir index au valeur entière inf
	const a1 = Math.ceil(index)              // arrondir index au valeur entière sup
	const percent = a0 !== ampColors.length - 1 ? index - a0 : 1                     // calcul pourcentage entre a0 et a1 (deux valeurs d'amplitude)ou se trouve l'amplitude
	const colorsArray = noBlack ? ampColorsWhite : ampColors                        // choisir la palette de couleur selon valeur(bool) de noBlack
	const a0Color = colorsArray[a0]
	const a1Color = colorsArray[a1]
	return chroma.mix(a0Color.hex(), a1Color.hex(), percent)                     //mixer les couleurs de a0 et a1 
}
