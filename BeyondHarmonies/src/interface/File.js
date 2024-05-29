import Tone, { Master, Player } from 'tone' 
import { EventEmitter } from 'events' 
import { FILE_PLAYS_SOUND } from '../Configuration' 
import './file.scss' 

export class File extends EventEmitter {
    constructor(){
        super() // appel du constructeur

        this.audioElement = document.createElement('audio') // créer un élément audio HTML
        this.audioElement.autoplay = true // l'option autoplay est Vrai (autoplay des entrées audio )
        this.audioElement.loop = true // option loop (pour mettre l'entrée audio en loop) est vrai
        this.audioMediaSource = Tone.context.createMediaElementSource(this.audioElement) // créer une source média pour l'élément audio
        if (FILE_PLAYS_SOUND){
            this.audioMediaSource.connect(Master) // connecter la source média au Master(noeud du sortie audio) 
        }

        this.player = new Player() // créer un lecteur audio "Player" de Tone
        this.player.loop = true 
        if (FILE_PLAYS_SOUND){
            this.player.toMaster() // Connexion du lecteur audio au Master 
        }
    }

    initialize(){
        this.loader = document.querySelector('acc-loader') 

        this.videoGroup = document.body.querySelector('#video-group') 

        this.videoElement = this.videoGroup.querySelector('video') 
        this.videoMediaSource = Tone.context.createMediaElementSource(this.videoElement) // Créer une source média pour l'élément HTML vidéo
        if (FILE_PLAYS_SOUND){
            this.videoMediaSource.connect(Master) 
        }

        this.videoElement.addEventListener('play', () => {
            this.videoControls.classList.add('playing') // ajouter de la classe 'playing' aux contrôles vidéo (scss) lors de la lecture
            this.videoControls.setAttribute('aria-pressed', false) // attribut aria-pressed à false
        })

        this.videoElement.addEventListener('pause', () => {
            this.videoControls.classList.remove('playing') // supprimer la classe 'playing' des contrôles vidéo (ficheir scss) lors de la pause
            this.videoControls.setAttribute('aria-pressed', true) // attribut aria-pressed à true
        })

        this.videoControls = this.videoGroup.querySelector('#video-controls') // sélectionner les contrôles vidéo
        this.videoControls.addEventListener('click', () => {
            if (this.videoControls.classList.contains('playing')){
                this.videoElement.pause() //  pause de la vidéo (si elle est en mode de lecture)
            } else {
                this.videoElement.play() // lecture de la vidéo (si elle est en pause)
            }
        })
    }

    /**
     * @param {boolean} l
     */
    set loading(l){
        this.loader.setAttribute('label', 'Loading File') // définir attribut 'label' à 'Loading File'
        if (l){
            this.loader.setAttribute('open', true) // Affichage du loader si l est vrai
        } else {
            this.loader.removeAttribute('open') // supprimer attribut 'open' du loader si l est faux
        }
    }

    playFile(url, mediaElement = this.videoElement){
        this.loading = true       
        this.stop() // arrêter la lecture précédente
        mediaElement.oncanplaythrough = () => {
            this.loading = false 
            if (mediaElement === this.videoElement){
                this.videoGroup.classList.add('playing') //  si le fichier est une vidéo d'échantillons
            }
        }

        mediaElement.onerror = async () => {
            mediaElement.src = ''
            if (mediaElement === this.videoElement){
                try {
                    await this.player.load(url) // Chargement du fichier avec le lecteur audio Player
                    this.player.start() // Démarrage de la lecture du fichier
                    this.loading = false // Masquage du loader après le démarrage
                } catch (e){
                    this._showError('Cannot play file') // Affichage d'une erreur si le fichier ne peut pas être lu
                }
            } else {
                this._showError('Cannot load file') // Affichage d'une erreur si le fichier ne peut pas être chargé
            }
        }

        mediaElement.onload = () => {
            window.URL.revokeObjectURL(url) // Révocation de l'URL de l'objet pour libérer de la mémoire
        }

        mediaElement.src = url 
        mediaElement.load() // Chargement du média
        return url
    }

    _showError(e){
        this.loading = false 
        const snackbar = document.querySelector('acc-snackbar') // Sélection de l'élément snackbar ( pour afficher le text de l'erreur)
        snackbar.message = e // définition du message d'erreur dans le snackbar
    }

    pause(){
        if (this.audioElement.src !== ''){
            this.audioElement.pause() // mise en pause de l'audio si une source est définie
        }
        if (this.videoElement.src !== ''){
            this._wasPlaying = this.videoControls.classList.contains('playing') // Vérification si la vidéo était en lecture avant la pause
            this.videoElement.pause() // mise en pause de la vidéo si une source est définie
        }
    }

    play(){
        if (this.audioElement.src !== ''){
            this.audioElement.play() // lecture de l'audio si une source est définie
        }
        if (this.videoElement.src !== '' && this._wasPlaying){
            this.videoElement.play() // reprise de la lecture de la vidéo si elle était en lecture avant la pause
        }
    }

    stop(){
        this.audioElement.pause() 
        this.videoElement.pause() 
        this.player.stop() 
        this.videoElement.removeAttribute('src') // supprimer la source de l'element vidéo
        this.audioElement.removeAttribute('src') // supprimer la source de l'élement audio
        this.videoGroup.classList.remove('playing') // retirer la classe 'playing' du groupe vidéo
        this.videoControls.classList.remove('playing') // retirer la classe 'playing' des contrôles vidéo
    }

    _readFile(file, url){
        this.stop() // arrêter la lecture en cours
        if (file){
            this.loading = true // afficher le loader lors du chargement du fichier
            const mediaElement = file.type.includes('audio') ? this.audioElement : this.videoElement // sélection de l'élément média approprié en fonction du type de fichier
            this.playFile(url, mediaElement) // lecture du fichier
            this.emit('file', file.name) // Émission de l'événement 'file' avec le nom du fichier
        } else {
            this._showError('Error: cannot play this file type') //une erreur est affiché si le type de fichier n'est pas pris en charge
        }
    }

    connect(node){
        this.audioMediaSource.connect(node) // Connexion de la source audio au nœud spécifié
        this.videoMediaSource.connect(node) // Connexion de la source vidéo au nœud spécifié
        this.player.connect(node) // Connexion du lecteur audio Player au nœud spécifié
    }
}
