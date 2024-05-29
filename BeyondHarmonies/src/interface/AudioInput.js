import { Gain } from 'tone'          //  module Gain de la bibliothèque 'tone' (Gain de tone.js permet la gestion de sortie audio)
import { File } from './File' 
import { Microphone } from './Mic' 

export class AudioInput {
    constructor(selectGroup, audioFiles, mic, fileDrop, inputSelect){
        this.output = new Gain()                      // Création du objet ( noeud) Gain pour la sortie audio

        this.selectGroup = selectGroup 
        this.audioFiles = audioFiles 
        this.fileDrop = fileDrop 

        this.select = inputSelect 

        this.mic = new Microphone(mic) // initialisation du micro 
        this.mic.on('open', () => this._select('None')) // écouteur d'événements pour réinitialiser la sélection quand le micro est ouvert
        this.mic.connect(this.output) // Connecter le micro à la sortie audio

        this.file = new File() // objet File pour la gestion des ficheirs audio (les fichiers d'echantillons fournis)
    }

    initialize(){
        this.file.initialize() 
        this.file.connect(this.output) // Connecter les fichiers à la sortie audio

        // écouteur d'événements pour la pause de la lecture audio (si l'élément 'acc-quiet-group' est en pause)
        document.querySelector('acc-quiet-group').addEventListener('pause', ({ detail }) => {
            if (detail.paused){
                this.pause() // pause la lecture audio
            } else {
                this.play() // reprendre la lecture audio
            }
        })

        // écouteur d'événements pour l'arrêt de l'audio  (si l'interface du tutoriel est activé)
        document.querySelector('acc-learn-more-group').addEventListener('tutorial', () => {
            this.clearFile() // effacer le fichier en cours de lecture
        })

        // écouteur d'événements pour changer la sélection d'entrée
        this.select.addEventListener('change', e => {
            this._select(e.detail.value) // appel de la méthode _select avec nouvelle valeur sélectionnée
        })
    }

    // fonction pour la gestion de la selection de l'entrée audio 
    async _select(item){
        if (item === 'None'){   //aucun objet selectionné
            this.file.stop() // stop la lecture du fichier
            this.mic.open() // ouvrir le microphone
            this.select.selectedIndex = 0 // index de sélection à 0 (réinitialisation)
            this.fileDrop.clear() // effacer les fichiers déposés
        } else if (item === 'Upload File'){   // choisir d'importer un fichier 
            this.mic.close() // désactiver le microphone
            this.select.selectedIndex = 0 // index de sélection à 0
        } else {
            this.mic.close() // désactiver le microphone
            if (item){  // un fichier d'échantillon est choisi
                this.fileDrop.clear() // effacer les fichiers déposés
                this.file.playFile(item) // lecture du fichier sélectionné
            }
        }
    }

    pause(){
        this.file.pause() //  pause la lecture du fichier
    }

    play(){
        this.file.play() // reprendre la lecture du fichier
    }

    off(){
        this.file.stop() // arrêter lecture du fichier
        this.select.selectedIndex = 0 // réinitialiser l'index de sélection
        this.mic.disabled = false // activation le microphone
    }

    setFile(f, url){
        this.file._readFile(f, url) // lecture du fichier à partir de l'URL fournie
        this._select('Upload File') // appel du fonction _select avec parametre "Upload File" pour indiquer le choix d'importer un fichier
    }

    clearFile(){
        this.file.stop() // arrêter la lecture du fichier
        this._select('None') // appel du fct _select avec parametre "none" pour indiquer que aucune entrée audio est selectionnée
    }
}
