# Module OCR pour AppEgo

Ce module permet aux utilisateurs d'uploader un fichier PDF ou une image, d'en extraire les données textuelles via un service OCR (Reconnaissance Optique de Caractères) et de les pré-remplir dans un formulaire.

## Fonctionnalités

- Upload d'un fichier PDF ou image (JPEG, PNG)
- Extraction de texte via OCR
- Identification des champs clés dans le document (ex : raison sociale, identifiant fiscal, etc.)
- Pré-remplissage d'un formulaire dynamique avec les données extraites

## Technologies Utilisées

- **Frontend** : Angular + PrimeNG pour l'UI
- **OCR Client** : Tesseract.js pour l'OCR côté client
- **Backend** : Spring Boot + Tess4J pour l'OCR côté serveur

## Configuration Requise

### Frontend

1. Installer Tesseract.js :
   ```
   npm install tesseract.js
   ```

2. Assurez-vous que les modules PrimeNG suivants sont installés :
   - FileUpload
   - Button
   - Card
   - ProgressBar
   - Toast
   - InputText
   - InputTextarea
   - Divider
   - ScrollPanel

### Backend

1. Installer Tesseract OCR sur votre système :
   - **Windows** : Télécharger depuis [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)
   - **Linux** : `sudo apt-get install tesseract-ocr`
   - **macOS** : `brew install tesseract`

2. Télécharger les données de langue française :
   - Créer un dossier `tessdata` dans votre répertoire utilisateur
   - Télécharger le fichier de données français (`fra.traineddata`) depuis [GitHub](https://github.com/tesseract-ocr/tessdata)
   - Placer le fichier dans le dossier `tessdata`

3. Vérifier que les dépendances Maven sont correctement configurées :
   ```xml
   <dependency>
       <groupId>net.sourceforge.tess4j</groupId>
       <artifactId>tess4j</artifactId>
       <version>5.8.0</version>
   </dependency>
   <dependency>
       <groupId>org.apache.pdfbox</groupId>
       <artifactId>pdfbox</artifactId>
       <version>3.0.0</version>
   </dependency>
   ```

## Utilisation

1. Accéder à la page OCR via l'URL `/ocr`
2. Télécharger un document (PDF ou image)
3. Choisir la méthode de traitement :
   - **Tesseract.js** : Traitement côté client (plus rapide, mais moins précis)
   - **Backend** : Traitement côté serveur (plus précis, mais nécessite une connexion au serveur)
4. Vérifier et modifier les champs extraits si nécessaire
5. Cliquer sur "Remplir le formulaire" pour utiliser les données extraites

## Personnalisation

### Extraction de Champs

Le module est configuré pour extraire les champs suivants :
- Raison Sociale
- Identifiant Fiscal
- ICE
- Registre de Commerce
- Adresse
- Ville
- Email
- Téléphone

Pour ajouter ou modifier les champs extraits, modifiez les méthodes `extractFields` dans :
- `ocr.component.ts` (frontend)
- `OcrService.java` (backend)

## Dépannage

### Problèmes Courants

1. **Erreur "Tesseract not found"** :
   - Vérifiez que Tesseract OCR est correctement installé sur votre système
   - Vérifiez que le chemin vers les données Tesseract est correctement configuré

2. **Faible précision de reconnaissance** :
   - Assurez-vous que l'image est de bonne qualité (résolution suffisante, bon contraste)
   - Essayez de prétraiter l'image (rotation, recadrage, amélioration du contraste)

3. **Erreur lors du traitement de PDF** :
   - Vérifiez que PDFBox est correctement configuré
   - Assurez-vous que le PDF n'est pas protégé par un mot de passe 