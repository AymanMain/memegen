# 🎨 Générateur de Mèmes - Projet d'Évaluation

## 📝 Description du Projet
Ce projet a été réalisé dans le cadre de mon évaluation en génie logiciel. Il s'agit d'une plateforme web permettant aux utilisateurs de créer, modifier et partager des mèmes de manière intuitive et interactive.

## 🎯 Objectifs d'Apprentissage
- Maîtrise du développement full-stack avec Next.js
- Implémentation d'authentification sécurisée
- Gestion de base de données NoSQL
- Manipulation d'images en temps réel
- Déploiement d'applications cloud-native

## 🛠️ Technologies Utilisées

### Frontend
- **Framework**: Next.js avec React
- **Styling**: TailwindCSS
- **Manipulation Canvas**: Konva.js
- **Gestion d'État**: Zustand
- **Icônes**: Lucide-react

### Backend
- **API**: Routes API Next.js (Serverless)
- **Base de Données**: MongoDB Atlas
- **Authentification**: Firebase Auth
- **Stockage**: Firebase Storage

### Tests
- **Tests Unitaires**: Jest
- **Tests E2E**: Cypress

## 🚀 Fonctionnalités Principales

### 1. Page d'Accueil
- Upload de fichiers avec glisser-déposer
- Sélection de templates
- Navigation vers l'éditeur

### 2. Éditeur de Mèmes
- Canvas interactif avec Konva.js
- Upload et redimensionnement d'images
- Ajout de texte avec personnalisation
- Prévisualisation en temps réel
- Sauvegarde dans la galerie
- Téléchargement et partage

### 3. Authentification
- Connexion/Inscription
- Authentification OAuth
- Protection des routes

### 4. Galerie Utilisateur
- Affichage des mèmes personnels
- Gestion (téléchargement, suppression, partage)

## 📦 Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/generateur-memes.git
cd generateur-memes
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env.local
```
Remplir les variables dans `.env.local` avec vos clés API

4. Lancer le serveur de développement :
```bash
npm run dev
```

## 🔧 Configuration Requise

### Variables d'Environnement
- `MONGODB_URI`: URL de connexion MongoDB
- `FIREBASE_API_KEY`: Clé API Firebase
- `FIREBASE_AUTH_DOMAIN`: Domaine d'authentification Firebase
- `FIREBASE_PROJECT_ID`: ID du projet Firebase
- `FIREBASE_STORAGE_BUCKET`: Bucket de stockage Firebase
- `FIREBASE_MESSAGING_SENDER_ID`: ID de l'expéditeur Firebase
- `FIREBASE_APP_ID`: ID de l'application Firebase

## 🧪 Tests

### Tests Unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run cypress
```

## 📚 Structure du Projet
```
src/
├── app/                 # Routes et pages Next.js
├── components/          # Composants React réutilisables
├── lib/                 # Utilitaires et configurations
├── models/             # Schémas MongoDB
├── store/              # État global (Zustand)
├── styles/             # Styles globaux
└── types/              # Types TypeScript
```

## 🤝 Contribution
Ce projet étant une évaluation, les contributions ne sont pas acceptées pour le moment.

## 📝 Notes de Développement
- Implémentation de la compression d'images pour optimiser les performances
- Utilisation de lazy loading pour la galerie
- Gestion des erreurs robuste
- Interface responsive avec TailwindCSS

## 📄 Licence
Ce projet est réalisé dans un cadre académique et n'est pas destiné à une utilisation commerciale.

## 👨‍💻 Auteur
[Votre Nom] - Étudiant en Génie Logiciel

---

*Projet réalisé dans le cadre de mon évaluation en génie logiciel - [Nom de l'École] - [Année]*
