import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OcrService } from '../../../service/ocr.service';
import * as Tesseract from 'tesseract.js';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SelectModule } from 'primeng/select';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectButton } from 'primeng/selectbutton';
import { InputMask } from 'primeng/inputmask';
import { Reservation } from '../../../reservation/models/reservation.model';

@Component({
    selector: 'app-coordonnees-reservation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        SelectButtonModule,
        DropdownModule,
        InputMaskModule,
        TextareaModule,
        FileUploadModule,
        ProgressBarModule,
        CardModule,
        ToastModule,
        DividerModule,
        ScrollPanelModule,
        SelectModule,
        DatePickerModule,
        OverlayPanelModule,
        DatePicker,
        SelectButton
    ],
    providers: [MessageService],
    templateUrl: './coordonnees-reservation.component.html',
    styleUrls: ['./coordonnees-reservation.component.scss'],
})
export class CoordonneesReservationComponent implements OnInit {
    @Input() initialData?: any;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() valideCoordonnees = new EventEmitter<Reservation>();
    @Input() reservation: Reservation | null = null;
    @ViewChild('fileUpload') fileUpload: any;
    @ViewChild('previewImage') previewImage!: ElementRef;
    @ViewChild('op') overlayPanel!: OverlayPanel;


    reservationForm!: FormGroup;
    selectedDate: Date | null = null;
    maxDate: Date = new Date();
    yearRange: string = '';
    displayDatePicker: boolean = false;

    civiliteOptions = [
        { label: 'M.', value: 'M' },
        { label: 'Mme', value: 'MME' }
    ];

    paysOptions = [
        { label: 'Maroc', value: 'MA' },
        { label: 'France', value: 'FR' },
        { label: 'Belgique', value: 'BE' },
        { label: 'Suisse', value: 'CH' },
        { label: 'Canada', value: 'CA' },
        { label: 'Espagne', value: 'ES' },
        { label: 'Italie', value: 'IT' }
    ];

    compagniesOptions = [
        { label: 'Royal Air Maroc', value: 'RAM' },
        { label: 'Air France', value: 'AF' },
        { label: 'EasyJet', value: 'EJ' },
        { label: 'Ryanair', value: 'RYR' },
        { label: 'Transavia', value: 'TO' },
        { label: 'Autre', value: 'AUTRE' }
    ];

    uploadedFile: File | null = null;
    imagePreviewUrl: string | ArrayBuffer | null = null;
    safePdfUrl: SafeResourceUrl | null = null;
    isProcessing = false;
    progress = 0;
    extractedText = '';
    extractedFields: any = {
        prenom: '',
        nom: '',
        email: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: ''
    };

    // Options d'indicatifs téléphoniques
    indicatifsOptions = [
        { label: '+212', value: '+212', flag: 'ma' }, // Maroc
        { label: '+33', value: '+33', flag: 'fr' },   // France
        { label: '+32', value: '+32', flag: 'be' },   // Belgique
        { label: '+41', value: '+41', flag: 'ch' },   // Suisse
        { label: '+1', value: '+1', flag: 'ca' },     // Canada
        { label: '+34', value: '+34', flag: 'es' },   // Espagne
        { label: '+39', value: '+39', flag: 'it' }    // Italie
    ];
    
    selectedIndicatif: any = this.indicatifsOptions[0]; // Default to Maroc (+212)

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private ocrService: OcrService,
        private sanitizer: DomSanitizer
    ) {
        this.initYearRange();
    }

    ngOnInit() {
        this.reservationForm = this.fb.group({
            civilite: ['M', [Validators.required]],
            nom: ['', [Validators.required]],
            prenom: ['', [Validators.required]],
            dateNaissance: [null, [Validators.required]],
            indicatif: [this.indicatifsOptions[0].value, [Validators.required]], 
            telephone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
            email: ['', [Validators.required, Validators.email]],
            pays: ['MA', [Validators.required]],
            adresse: ['', [Validators.required]],
            codePostal: ['', [Validators.required]],
            ville: ['', [Validators.required]],
            compagnie: [null],
            observations: ['']
        });

        if (this.initialData) {
            this.reservationForm.patchValue(this.initialData);
            
            // Si un indicatif est présent dans les données initiales
            if (this.initialData.indicatif) {
                this.selectedIndicatif = this.indicatifsOptions.find(option => 
                    option.value === this.initialData.indicatif) || this.indicatifsOptions[0];
            }
            
            // Initialiser selectedDate avec la valeur du form control
            if (this.initialData.dateNaissance) {
                this.selectedDate = new Date(this.initialData.dateNaissance);
            }
        }
        
        // Surveiller les changements du FormControl dateNaissance
        this.reservationForm.get('dateNaissance')?.valueChanges.subscribe(value => {
            if (value && this.selectedDate !== value) {
                this.selectedDate = value;
            }
        });
    }

    private initYearRange() {
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 100;
        this.yearRange = `${minYear}:${currentYear}`;
        this.maxDate = new Date();
    }

    focusInput(inputId: string): void {
        const element = document.getElementById(inputId);
        if (element) {
            element.focus();
        }
    }

    onSubmit() {
        if (this.reservationForm.valid) {
            // Ajouter le numéro de téléphone complet pour le backend si nécessaire
            const formValue = {
                ...this.reservationForm.value,
                telephoneComplet: this.fullPhoneNumber
            };
            
            this.formSubmit.emit(formValue);
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Vos coordonnées ont été enregistrées avec succès'
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            this.markFormGroupTouched(this.reservationForm);
        }
    }

    onUpload(event: any) {
        this.uploadedFile = event.files[0];
        this.showPreview();
    }

    showPreview() {
        if (!this.uploadedFile) return;
        
        if (this.uploadedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreviewUrl = e.target?.result || null;
                this.safePdfUrl = null;
            };
            reader.readAsDataURL(this.uploadedFile);
        } 
        else if (this.uploadedFile.type === 'application/pdf') {
            const pdfUrl = URL.createObjectURL(this.uploadedFile);
            this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
            this.imagePreviewUrl = pdfUrl;
            
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
            }, 100);
        } 
        else {
            this.imagePreviewUrl = null;
            this.safePdfUrl = null;
            this.messageService.add({
                severity: 'info',
                summary: 'Aperçu non disponible',
                detail: 'L\'aperçu n\'est disponible que pour les images et les PDF.'
            });
        }
    }

    async processWithTesseract() {
        if (!this.uploadedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez d\'abord télécharger un fichier'
            });
            return;
        }

        if (!this.uploadedFile.type.startsWith('image/')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Format non supporté',
                detail: 'Tesseract.js ne peut traiter que des images. Utilisez le traitement côté serveur pour les PDF.'
            });
            return;
        }

        this.isProcessing = true;
        this.progress = 0;

        try {
            const imageUrl = URL.createObjectURL(this.uploadedFile);
            
            const worker = await Tesseract.createWorker({
                logger: progress => {
                    if (progress.status === 'recognizing text') {
                        this.progress = Math.round(progress.progress * 100);
                    }
                },
                langPath: 'https://raw.githubusercontent.com/tesseract-ocr/tessdata/main',
                gzip: false
            });
            
            await worker.loadLanguage('fra');
            await worker.initialize('fra');
            
            const result = await worker.recognize(imageUrl);
            
            await worker.terminate();
            URL.revokeObjectURL(imageUrl);
            
            this.extractedText = result.data.text;
            
            this.extractFields(this.extractedText);
            
            this.isProcessing = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Texte extrait avec succès'
            });
        } catch (error) {
            console.error('OCR Error:', error);
            this.isProcessing = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de l\'extraction du texte'
            });
        }
    }

    processWithBackend() {
        if (!this.uploadedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez d\'abord télécharger un fichier'
            });
            return;
        }

        const supportedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
        if (!supportedTypes.includes(this.uploadedFile.type)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Format non supporté',
                detail: 'Seuls les formats JPEG, PNG, TIFF et PDF sont supportés.'
            });
            return;
        }

        this.isProcessing = true;
        this.progress = 0;

        const formData = new FormData();
        formData.append('file', this.uploadedFile);

        this.ocrService.processDocument(formData).subscribe({
            next: (response: any) => {
                this.extractedText = response.text;
                this.extractFields(this.extractedText);
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Document traité avec succès'
                });
            },
            error: (error) => {
                console.error('Backend OCR Error:', error);
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors du traitement du document'
                });
            }
        });
    }

    extractFields(text: string) {
        // Extraction des champs pertinents pour le formulaire de réservation
        const prenomMatch = text.match(/Prénom[:\s]+([^\n]+)/i);
        const nomMatch = text.match(/Nom[:\s]+([^\n]+)/i);
        const emailMatch = text.match(/Email[:\s]+([^\n]+)/i);
        const adresseMatch = text.match(/Adresse[:\s]+([^\n]+)/i);
        const codePostalMatch = text.match(/Code postal[:\s]+([^\n]+)/i);
        const villeMatch = text.match(/Ville[:\s]+([^\n]+)/i);
        const telephoneMatch = text.match(/Téléphone[:\s]+([^\n]+)/i);

        this.extractedFields = {
            prenom: prenomMatch ? prenomMatch[1].trim() : '',
            nom: nomMatch ? nomMatch[1].trim() : '',
            email: emailMatch ? emailMatch[1].trim() : '',
            adresse: adresseMatch ? adresseMatch[1].trim() : '',
            codePostal: codePostalMatch ? codePostalMatch[1].trim() : '',
            ville: villeMatch ? villeMatch[1].trim() : '',
            telephone: telephoneMatch ? telephoneMatch[1].trim() : ''
        };

        // Remplir automatiquement le formulaire
        this.fillForm();
    }

    fillForm() {
        if (this.extractedFields) {
            Object.keys(this.extractedFields).forEach(key => {
                if (this.reservationForm.contains(key)) {
                    this.reservationForm.get(key)?.setValue(this.extractedFields[key]);
                }
            });
        }
    }

    clear() {
        this.uploadedFile = null;
        this.imagePreviewUrl = null;
        this.safePdfUrl = null;
        this.extractedText = '';
        this.extractedFields = {
            prenom: '',
            nom: '',
            email: '',
            adresse: '',
            codePostal: '',
            ville: '',
            telephone: ''
        };
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    onDateSelect(event: Date): void {
        this.selectedDate = event;
        this.reservationForm.get('dateNaissance')?.setValue(event);
        this.reservationForm.get('dateNaissance')?.markAsDirty();
        this.reservationForm.get('dateNaissance')?.updateValueAndValidity();
        this.overlayPanel.hide();
    }

    formatDate(date: Date | null): string {
        if (!date) return '';
        return new Intl.DateTimeFormat('fr-FR').format(date);
    }

    onManualDateInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;
        
        // Supprimer tous les caractères non numériques et non slash
        let cleaned = value.replace(/[^\d\/]/g, '');
        
        // Conserver seulement les chiffres pour traitement
        let digits = cleaned.replace(/\//g, '');
        
        // Limiter à 8 chiffres (JJ/MM/AAAA)
        if (digits.length > 8) {
            digits = digits.substring(0, 8);
        }
        
        // Reconstruire le format avec slashes
        let formatted = '';
        if (digits.length > 0) {
            // Ajouter les deux premiers chiffres pour le jour
            formatted = digits.substring(0, Math.min(2, digits.length));
            
            // Ajouter un slash et les deux chiffres suivants pour le mois
            if (digits.length > 2) {
                formatted += '/' + digits.substring(2, Math.min(4, digits.length));
                
                // Ajouter un slash et jusqu'à 4 chiffres pour l'année
                if (digits.length > 4) {
                    formatted += '/' + digits.substring(4, 8);
                }
            }
        }
        
        // Si la valeur a changé, mettre à jour l'input
        if (formatted !== value) {
            input.value = formatted;
            
            // Correction de la position du curseur après formatage
            const cursorPos = this.getCursorPosition(value, formatted);
            setTimeout(() => {
                input.setSelectionRange(cursorPos, cursorPos);
            }, 0);
        }
    }
    
    // Fonction utilitaire pour calculer la position du curseur après formatage
    private getCursorPosition(oldValue: string, newValue: string): number {
        // Compter le nombre de slashes avant la position du curseur dans l'ancienne valeur
        const cursorPos = (document.activeElement as HTMLInputElement)?.selectionStart || 0;
        const slashesBeforeCursor = (oldValue.substring(0, cursorPos).match(/\//g) || []).length;
        const digitsBeforeCursor = oldValue.substring(0, cursorPos).replace(/\//g, '').length;
        
        // Calculer la nouvelle position en tenant compte des slashes ajoutés
        let newPos = digitsBeforeCursor;
        if (newPos > 2) newPos++; // Ajouter 1 pour le premier slash
        if (newPos > 4) newPos++; // Ajouter 1 pour le deuxième slash
        
        return Math.min(newPos, newValue.length);
    }

    validateManualDate(event: Event): void {
        try {
            const input = event.target as HTMLInputElement;
            const dateValue = input.value;
            
            if (!dateValue || dateValue.trim() === '') {
                // Si le champ est vide, on supprime la date
                this.reservationForm.patchValue({ dateNaissance: null });
                return;
            }
            
            // Format attendu: JJ/MM/AAAA
            const dateParts = dateValue.split('/');
            if (dateParts.length !== 3) {
                throw new Error('Format de date invalide');
            }
            
            // Vérifier la longueur des parties
            if (dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 4) {
                throw new Error('Format de date invalide (JJ/MM/AAAA)');
            }
            
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Les mois en JS commencent à 0
            const year = parseInt(dateParts[2], 10);
            
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
                throw new Error('Format de date invalide');
            }
            
            // Vérifier les bornes des valeurs
            if (day < 1 || day > 31) {
                throw new Error('Le jour doit être entre 1 et 31');
            }
            
            if (month < 0 || month > 11) {
                throw new Error('Le mois doit être entre 01 et 12');
            }
            
            const date = new Date(year, month, day);
            
            // Vérifier si la date est valide (ex: 30/02/2023 n'existe pas)
            if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
                throw new Error('Date invalide pour ce mois');
            }
            
            // Vérifier si la date est dans la plage autorisée
            if (date > this.maxDate) {
                throw new Error('La date doit être dans le passé');
            }
            
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - 100;
            if (year < minYear || year > currentYear) {
                throw new Error(`L'année doit être entre ${minYear} et ${currentYear}`);
            }
            
            // Date valide, mettre à jour le formulaire
            this.selectedDate = date;
            this.reservationForm.patchValue({ dateNaissance: date });
            
        } catch (error: any) {
            // Restaurer la date précédente
            const currentDate = this.reservationForm.get('dateNaissance')?.value;
            const input = event.target as HTMLInputElement;
            input.value = currentDate ? this.formatDate(currentDate) : '';
            
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: error.message || 'Format de date invalide. Utilisez le format JJ/MM/AAAA.'
            });
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    // Synchronise les changements d'indicatif téléphonique
    onIndicatifChange(event: any) {
        this.selectedIndicatif = event;
        this.reservationForm.patchValue({ indicatif: event.value });
        console.log('Indicatif sélectionné:', this.selectedIndicatif);
    }

    // Récupère le numéro de téléphone complet (indicatif + numéro)
    get fullPhoneNumber(): string {
        const indicatif = this.reservationForm.get('indicatif')?.value || '';
        const telephone = this.reservationForm.get('telephone')?.value || '';
        return `${indicatif}${telephone}`;
    }

    /**
     * Efface le contenu d'un champ spécifique du formulaire
     * @param fieldName - Nom du champ à vider
     */
    clearField(fieldName: string): void {
        // Pour le champ téléphone, on conserve l'indicatif
        if (fieldName === 'telephone') {
            this.reservationForm.get(fieldName)?.setValue('');
            this.reservationForm.get(fieldName)?.markAsPristine();
        } 
        // Pour la date de naissance, il faut aussi mettre à jour selectedDate
        else if (fieldName === 'dateNaissance') {
            this.reservationForm.get(fieldName)?.setValue(null);
            this.reservationForm.get(fieldName)?.markAsPristine();
            this.selectedDate = null;
        }
        // Pour tous les autres champs
        else {
            this.reservationForm.get(fieldName)?.setValue('');
            this.reservationForm.get(fieldName)?.markAsPristine();
        }
    }

    onValideCoordonnees() {
        if (this.reservationForm.valid && this.reservation) {
            this.reservation.email = this.reservationForm.value.email;
            this.reservation.nom = this.reservationForm.value.nom;
            this.reservation.prenom = this.reservationForm.value.prenom;
            this.reservation.dateNaissance = this.reservationForm.value.dateNaissance;
            this.reservation.indicatif = this.reservationForm.value.indicatif;
            this.reservation.telephone = this.reservationForm.value.telephone;
            this.reservation.civilite = this.reservationForm.value.civilite;
            this.reservation.compagnie = this.reservationForm.value.compagnie;
            this.reservation.adresse = this.reservationForm.value.adresse;
            this.reservation.codePostal = this.reservationForm.value.codePostal;
            this.reservation.ville = this.reservationForm.value.ville;
            this.reservation.pays = this.reservationForm.value.pays;
            this.valideCoordonnees.emit(this.reservation);
            
            // Afficher un message de succès
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Vos coordonnées ont été enregistrées avec succès'
            });
        } else {
            // Marquer tous les champs comme touchés pour afficher les erreurs
            this.markFormGroupTouched(this.reservationForm);
            
            // Afficher un message d'erreur
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs obligatoires'
            });
        }
    }
} 