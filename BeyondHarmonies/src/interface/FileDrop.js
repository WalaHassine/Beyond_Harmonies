import { EventEmitter } from 'events' 
import './file.scss' 
import toHtml from 'string-to-dom' 
import Tone, { Buffer } from 'tone' 
import FileReader from 'promise-file-reader' //  FileReader pour lire des fichiers avec des promesses
import dragDrop from 'drag-drop' // dragDrop pour gérer les opérations de glisser-déposer

export class FileDrop extends EventEmitter {
    constructor(returnType='url'){
        super() // constructeur d'EventEmitter

        this.returnType = returnType // définir le type de retour

        this.element = document.body.querySelector('#file-drop') //  l'élément de dépôt de fichiers
        this.button = this.element.querySelector('#uploadButton') //  bouton de téléchargement
        this.status = this.element.querySelector('#uploadedFile') // l'élément de statut des fichiers téléchargés

        
         // Gestion du glisser-déposer
         
        dragDrop('body', (files) => {
            const file = files[0]
            this._getFile(file) // Appel du méthode pour gérer le fichier déposé
        })

       
        this.fileDialog = this.element.querySelector('.file-input') // Sélection de l'élément de dialogue de fichier
        this.fileDialog.addEventListener('change', e => {
            if (e.target.files && e.target.files[0]){
                this._getFile(e.target.files[0]) // Appel de la méthode pour gérer le fichier sélectionné
            }
        })

        this.button.addEventListener('click', () => this.openDialog()) // Ouvrir le dialogue de fichier au clic sur le bouton
        this.status.addEventListener('click', () => {
            this.clear() // Effacer le fichier sélectionné au clic sur le statut
            this.emit('clear') // Émettre un événement de type 'clear'
        })

        this.on('file', f => this.currentFile = f.name) // mise a jour le fichier courant à la réception d'un événement 'file'
        this.on('error', e => {
            document.querySelector('acc-snackbar').message = e // Afficher le message d'erreur dans un snackbar
            document.querySelector('acc-snackbar').show() // Afficher le snackbar
            this.clear() // Effacer le fichier courant en cas d'erreur
        })
    }

    openDialog(){
        this.fileDialog.click() // Ouvrir le dialogue de fichier
    }

    clear(){
        this.fileDialog.value = '' // Réinitialiser la valeur du dialogue de fichier
        this.currentFile = '' // Réinitialiser le fichier courant
    }

    get value(){
        return this.fileDialog.value // Retourner la valeur actuelle du dialogue de fichier
    }

    set value(v){
        this.fileDialog.value = v // Définir la valeur du dialogue de fichier
    }

    set currentFile(f){
        const uploadedFile = this.status
        if (f === ''){
            uploadedFile.textContent = 'no file chosen' // Texte affiché lorsqu'aucun fichier n'est choisi
            uploadedFile.classList.add('nofile') // Ajouter la classe 'nofile'
            uploadedFile.setAttribute('aria-label', 'no chosen file') // Définir l'attribut aria-label
            uploadedFile.setAttribute('tabindex', '-1') // Définir l'attribut tabindex
            uploadedFile.setAttribute('role', 'status') // Définir le rôle de l'élément
        } else {
            uploadedFile.textContent = f // Afficher le nom du fichier choisi
            uploadedFile.setAttribute('tabindex', '0') // Définir l'attribut tabindex
            uploadedFile.classList.remove('nofile') // Retirer la classe 'nofile'
            uploadedFile.setAttribute('aria-label', `clear uploaded file ${f}`) // Définir l'attribut aria-label
            uploadedFile.setAttribute('role', 'button') // Définir le rôle de l'élément
        }
    }

    _canPlayFile(f){
        const audio = document.createElement('audio')
        return audio.canPlayType(f.type) !== '' // Vérifier si le fichier peut être lu
    }

    async _getFile(f){
        this.emit('dropped') // Émettre un événement 'dropped'
        if (this._canPlayFile(f)){
            if (this.returnType === 'url'){
                const src = window.URL.createObjectURL(f) // Créer une URL pour le fichier
                this.emit('file', f, src) // Émettre un événement 'file' avec l'URL du fichier
            } else {
                const results = await FileReader.readAsArrayBuffer(f) // Lire le fichier en tant que ArrayBuffer
                const buffer = await Tone.context.decodeAudioData(results) // Décoder les données audio
                this.emit('file', f, buffer) // Émettre un événement 'file' avec le buffer audio
            }
        } else {
            this.emit('error', `Sorry cannot play file type ${f.name}.`) // Émettre un événement 'error' si le fichier ne peut pas être lu
        }
    }
}
