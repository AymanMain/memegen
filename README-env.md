# Configuration des Variables d'Environnement

Ce document explique les variables d'environnement nécessaires pour faire fonctionner l'application.

## 🚀 Comment Configurer

1. Créez un fichier `.env.local` à la racine du projet
2. Copiez les variables ci-dessous dans ce fichier
3. Remplacez les valeurs par vos propres clés d'API

## 📝 Variables Requises

### MongoDB
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
- Obtenez cette URL depuis votre dashboard MongoDB Atlas
- Remplacez `<username>`, `<password>`, `<cluster>` et `<database>` par vos informations

### Firebase
```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```
- Ces informations sont disponibles dans les paramètres de votre projet Firebase
- Allez dans la console Firebase > Paramètres du projet > Général

### JWT (JSON Web Token)
```env
JWT_SECRET=votre_jwt_secret
```
- Générez une chaîne aléatoire sécurisée pour cette valeur
- Utilisez un générateur de secrets ou une commande comme `openssl rand -base64 32`

### Application
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```
- En développement, gardez ces valeurs par défaut
- En production, mettez à jour `NEXT_PUBLIC_APP_URL` avec votre URL de production

### Limites d'Upload
```env
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```
- `NEXT_PUBLIC_MAX_FILE_SIZE` est en bytes (5MB par défaut)
- `NEXT_PUBLIC_ALLOWED_FILE_TYPES` liste les types MIME autorisés

## 🔒 Sécurité

- Ne partagez JAMAIS votre fichier `.env.local`
- Ne committez JAMAIS ce fichier dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`

## 🧪 Environnements

- `.env.local` : Variables locales (non commitées)
- `.env.development` : Variables de développement
- `.env.production` : Variables de production
- `.env.test` : Variables pour les tests

## ⚠️ Notes Importantes

1. Toutes les variables commençant par `NEXT_PUBLIC_` sont accessibles côté client
2. Les autres variables sont uniquement accessibles côté serveur
3. Redémarrez le serveur de développement après avoir modifié les variables d'environnement 