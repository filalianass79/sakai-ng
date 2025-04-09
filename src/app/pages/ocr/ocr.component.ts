import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OcrService } from '../service/ocr.service';
import * as Tesseract from 'tesseract.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService } from '../auth/core/services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FileUploadModule,
    ProgressBarModule,
    CardModule,
    ToastModule,
    InputTextModule,
    TextareaModule,
    DividerModule,
    ScrollPanelModule
  ],
  templateUrl: './ocr.component.html',
  providers: [MessageService]
})
export class OcrComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload: any;
  @ViewChild('previewImage') previewImage!: ElementRef;

  uploadedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  isProcessing = false;
  progress = 0;
  extractedText = '';
  extractedFields: any = {
    raisonSocial: '',
    identifiantFiscal: '',
    ice: '',
    registreCommerce: '',
    adresse: '',
    ville: '',
    email: '',
    telephone: ''
  };
  
  constructor(
    private messageService: MessageService,
    private ocrService: OcrService,
    private userService: UserService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Test de connexion au serveur au chargement du composant
    this.testServerConnection();
  }

  // Méthode pour tester la connexion au serveur
  testServerConnection() {
    // Test CORS avec un endpoint public simple
    this.http.get(`${environment.apiUrl}/api/public/cors-test`, {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        console.log('Test CORS réussi:', response);
        this.messageService.add({
          severity: 'info',
          summary: 'Test CORS OK',
          detail: 'La configuration CORS fonctionne correctement'
        });
        
        // Continuer avec le test de connexion utilisateur
        this.userService.getAllUsers().subscribe({
          next: (response: any) => {
            console.log('Connexion au serveur réussie:', response);
            this.messageService.add({
              severity: 'info',
              summary: 'Connexion OK',
              detail: 'Connexion au serveur établie avec succès'
            });
          },
          error: (error) => {
            console.error('Erreur de connexion au serveur:', error);
            this.messageService.add({
              severity: 'warn',
              summary: 'Problème de connexion',
              detail: `Impossible de se connecter au serveur: ${error.status} ${error.statusText}`
            });
          }
        });
      },
      error: (error) => {
        console.error('Test CORS échoué:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Problème CORS',
          detail: `La configuration CORS ne fonctionne pas: ${error.status} ${error.statusText}`
        });
      }
    });
  }

  onUpload(event: any) {
    this.uploadedFile = event.files[0];
    this.showPreview();
  }

  showPreview() {
    if (!this.uploadedFile) return;
    
    // Si c'est une image, afficher directement
    if (this.uploadedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result || null;
        this.safePdfUrl = null;
      };
      reader.readAsDataURL(this.uploadedFile);
    } 
    // Si c'est un PDF, générer un aperçu
    else if (this.uploadedFile.type === 'application/pdf') {
      // Créer une URL pour le fichier PDF
      const pdfUrl = URL.createObjectURL(this.uploadedFile);
      
      // Sécuriser l'URL pour Angular
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
      this.imagePreviewUrl = pdfUrl;
      
      // Nettoyer l'URL lorsque le composant est détruit
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 100);
    } 
    // Pour les autres types de fichiers, pas d'aperçu
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

    // Check if the file is an image (Tesseract.js works best with images)
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
      // Create a URL for the image file
      const imageUrl = URL.createObjectURL(this.uploadedFile);
      
      // Initialize Tesseract worker with specific path
      const worker = await Tesseract.createWorker({
        logger: progress => {
          if (progress.status === 'recognizing text') {
            this.progress = Math.round(progress.progress * 100);
          }
        },
        langPath: 'https://raw.githubusercontent.com/tesseract-ocr/tessdata/main',
        gzip: false
      });
      
      // Load language
      await worker.loadLanguage('fra');
      await worker.initialize('fra');
      
      // Recognize text
      const result = await worker.recognize(imageUrl);
      
      // Clean up
      await worker.terminate();
      URL.revokeObjectURL(imageUrl);
      
      this.extractedText = result.data.text;
      
      // Extract fields from text
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

    // Vérifier si le fichier est d'un type supporté (image ou PDF)
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

    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    // Simuler une progression (le backend ne renvoie pas de progression en temps réel)
    const progressInterval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 90) {
        clearInterval(progressInterval);
      }
    }, 300);

    // Envoyer le fichier au backend pour traitement OCR
    this.ocrService.processDocument(formData).subscribe({
      next: (result) => {
        clearInterval(progressInterval);
        this.progress = 100;
        this.isProcessing = false;
        
        this.extractedText = result.extractedText;
        
        // Si des champs ont été extraits par le backend, les utiliser
        if (result.extractedFields) {
          this.extractedFields = result.extractedFields;
        } else {
          // Sinon, extraire les champs côté client
          this.extractFields(this.extractedText);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Document traité avec succès'
        });
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isProcessing = false;
        this.progress = 0;
        
        console.error('Erreur de traitement OCR:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: `Erreur lors du traitement du document: ${error.message || 'Erreur inconnue'}`
        });
      }
    });
  }

  extractFields(text: string) {
    // Simple pattern matching for demonstration
    // In a real application, you would use more sophisticated NLP or regex patterns
    
    // Extract company name (Raison Sociale)
    const raisonSocialMatch = text.match(/(?:raison sociale|société)\s*:?\s*([^\n]+)/i);
    if (raisonSocialMatch) this.extractedFields.raisonSocial = raisonSocialMatch[1].trim();
    
    // Extract fiscal ID
    const idFiscalMatch = text.match(/(?:identifiant fiscal|IF)\s*:?\s*([0-9]+)/i);
    if (idFiscalMatch) this.extractedFields.identifiantFiscal = idFiscalMatch[1].trim();
    
    // Extract ICE
    const iceMatch = text.match(/(?:ICE|identifiant commun)\s*:?\s*([0-9]+)/i);
    if (iceMatch) this.extractedFields.ice = iceMatch[1].trim();
    
    // Extract RC (Registre de Commerce)
    const rcMatch = text.match(/(?:RC|registre de commerce)\s*:?\s*([0-9]+)/i);
    if (rcMatch) this.extractedFields.registreCommerce = rcMatch[1].trim();
    
    // Extract address
    const addressMatch = text.match(/(?:adresse|siège social)\s*:?\s*([^\n]+)/i);
    if (addressMatch) this.extractedFields.adresse = addressMatch[1].trim();
    
    // Extract city
    const cityMatch = text.match(/(?:ville)\s*:?\s*([^\n]+)/i);
    if (cityMatch) this.extractedFields.ville = cityMatch[1].trim();
    
    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    if (emailMatch) this.extractedFields.email = emailMatch[0].trim();
    
    // Extract phone number
    const phoneMatch = text.match(/(?:\+212|0)[0-9]{9}/i);
    if (phoneMatch) this.extractedFields.telephone = phoneMatch[0].trim();
  }

  fillForm() {
    // Navigate to the form with extracted data
    // This would typically use a router to navigate to the form page
    // with the extracted data as query parameters or state
    console.log('Filling form with:', this.extractedFields);
    
    // For demonstration, we'll just show a success message
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Les données extraites sont prêtes à être utilisées dans le formulaire'
    });
  }

  clear() {
    this.uploadedFile = null;
    this.imagePreviewUrl = null;
    this.extractedText = '';
    this.extractedFields = {
      raisonSocial: '',
      identifiantFiscal: '',
      ice: '',
      registreCommerce: '',
      adresse: '',
      ville: '',
      email: '',
      telephone: ''
    };
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }
} 