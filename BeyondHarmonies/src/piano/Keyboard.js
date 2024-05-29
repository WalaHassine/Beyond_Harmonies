

import WebMidi from 'webmidi'
import { EventEmitter } from 'events'

export class MidiKeyboard extends EventEmitter {
	constructor(){
		super()

		this.connectedDevices = new Map()                   //map pour stocker les peripheroques connectées

		if (WebMidi.supported){                             // tester si webmidi est supporté par le navigateur
			this.ready = new Promise((done, error) => {      //créer promesse pour l'initialisation
				WebMidi.enable((e) => {  //activation de webmidi
                    //gestion d'erreurs
					if (e){
						error(e)                  //rejet de promesse si erreur
					}
					WebMidi.inputs.forEach(i => this._addListeners(i))       //ajouetr des listeners aux peripheroques d'entrée MIDI
					WebMidi.addListener('connected', (e) => {                //ecouteur pour connexion de peripheriques 
						if (e.port.type === 'input'){                         //verifier si peripherique est d'entrée
							this._addListeners(e.port)                         //ajouter des ecouteur pour nouveau peripherique connecté
						}
					})
					WebMidi.addListener('disconnected', (e) => {               //ecouteur pour ma deconnexion de peripheriques
						this._removeListeners(e.port)                          //supprimer des ecouteurs pour ce peripherique deconnecté
					})
					done()                                                //resolution de promesse si initialisation est terminée
				})
			})
		} else {
			this.ready = Promise.resolve()                              // si webmidi pas supporté par navigateur créer promesse résolue imediatement
		
		}
	}

	 //la methode pour ajouter des ecouteurs pour un peripherique MIDI
	_addListeners(device){

		if (!this.connectedDevices.has(device.id)){                       //verifier si peripherique n'est pas deja connecté
			this.connectedDevices.set(device.id, device)                  //stockage de peripherique connectée dans map(connected devices list)

			device.addListener('noteon', 'all', (event) => {                     //ecouteur lorsque le note est joué
				this.emit('keyDown', `${event.note.name}${event.note.octave}`, event.velocity)           //emission de event keyDown (note, velocité)
			})
			device.addListener('noteoff', 'all', (event) => {                    //ecouteru lorsque le note est relachée
				this.emit('keyUp', `${event.note.name}${event.note.octave}`, event.velocity)             //emission de event keyUp (note, velocité)
			})

			device.addListener('controlchange', 'all', (event) => {              //ecouteur pour les changements de control MIDI
				if (event.controller.name === 'holdpedal'){                     // si la pedale est le controleur
					this.emit(event.value ? 'pedalDown' : 'pedalUp')            //emission de event pedalDown or pedalUp en fct de valeur 
				}
			})
		}

	}

	// methode pour supprimer les ecouteurs d'un peripherique deconnacté
	_removeListeners(event){
		if (this.connectedDevices.has(event.id)){                     // si peripherique dans la liste de mappaghe des peripherique connectée
			const device = this.connectedDevices.get(event.id)        // recuperation du peripherique a partir du liste
			this.connectedDevices.delete(event.id)                    // supprimer peripherique de liste des devices connecté
			device.removeListener('noteon')                           //supprimer event listenner noteon
			device.removeListener('noteoff')                          //supprimer event listenner noteoff
			device.removeListener('controlchange')                    //supprimer event listenner controlchange
			
		}
	}
}
