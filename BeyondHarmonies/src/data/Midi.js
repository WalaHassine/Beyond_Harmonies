


export function ftom(freq){
	return 69 + 12 * Math.log2(freq / 440)           //69 val MIDI de note A4: note de reference dans les calculs
	                                                // 440 freq de A4
	                                                // 12 est l'octave : intervalle de 12 demi-tons
}
