# Allô Dakar 🚗

Application mobile de transport interurbain au Sénégal

## 📱 À propos

Allô Dakar est une application de transport similaire à Uber, spécialement conçue pour le Sénégal. Elle propose deux services principaux :

- **Voyager** : Transport de passagers entre les villes
- **Yobanté** : Livraison de colis

## 🎨 Design

### Couleurs de marque
- **Jaune vif** : `#facc15` - Couleur primaire
- **Gris foncé** : `#1f2937` - Textes et éléments sombres
- **Gris clair** : `#f9fafb` - Arrière-plans
- **Gris moyen** : `#6b7280` - Textes secondaires

### Principes de design
- Coins arrondis pour tous les éléments UI (border-radius: 12-24px)
- Ombres subtiles pour la profondeur
- Design mobile-first
- Interface intuitive et accessible

## 🏗️ Architecture

### Structure du projet
```
/
├── components/
│   ├── common/           # Composants réutilisables
│   │   ├── AppLogo.tsx
│   │   ├── AppHeader.tsx
│   │   └── BottomNav.tsx
│   ├── screens/          # Écrans de l'application
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ClientDashboard.tsx
│   │   ├── DriverDashboard.tsx
│   │   └── ...
│   └── ui/               # Composants UI (shadcn)
├── contexts/             # Contexts React
│   └── AppContext.tsx
├── lib/                  # Utilitaires et types
│   ├── types.ts
│   ├── constants.ts
│   └── utils-custom.ts
├── styles/
│   └── globals.css
└── App.tsx              # Point d'entrée
```

### Technologies utilisées
- **React 18** avec TypeScript
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

## 🚀 Fonctionnalités

### Interface Client
- ✅ Réservation de voyages (Voyager)
- ✅ Envoi de colis (Yobanté)
- ✅ Suivi en temps réel
- ✅ **Bannière de réservation active** - Navigation libre entre pages
- ✅ Génération automatique de SMS pour les destinataires
- ✅ Choix du mode de paiement (Wave, OM, Yass)
- ✅ Gestion du profil

### Interface Chauffeur
- ✅ Visualisation des demandes de courses
- ✅ Acceptation/refus de courses
- ✅ **Bannière de course active** - Navigation libre entre pages
- ✅ Navigation GPS
- ✅ Suivi des gains (jour, semaine, mois)
- ✅ Statistiques de performance

### 🆕 Système de gestion des réservations/courses actives

L'application dispose maintenant d'un système complet permettant aux utilisateurs de naviguer librement tout en conservant l'accès à leur réservation ou course en cours :

- **Pour les clients** : Une bannière s'affiche automatiquement sur la page d'accueil dès qu'une réservation est créée, permettant de retourner rapidement au suivi
- **Pour les chauffeurs** : Une bannière similaire s'affiche après l'acceptation d'une course
- **Navigation fluide** : Les utilisateurs peuvent basculer entre l'accueil et le suivi sans perdre leur session active
- **Annulation sécurisée** : Dialogues de confirmation pour toute annulation

📄 Voir [ACTIVE_BOOKING_SYSTEM.md](./ACTIVE_BOOKING_SYSTEM.md) pour la documentation détaillée

## 🗺️ Navigation

### Routes Client
- `/` - Écran d'accueil
- `/login` - Connexion
- `/register/client` - Inscription client
- `/client/dashboard` - Tableau de bord
- `/client/waiting` - Attente de chauffeur
- `/client/tracking` - Suivi de course
- `/profile` - Profil utilisateur
- `/info` - Informations

### Routes Chauffeur
- `/register/driver` - Inscription chauffeur
- `/driver/dashboard` - Demandes de courses
- `/driver/navigation` - Navigation en cours
- `/driver/earnings` - Gains et statistiques

## 💡 Améliorations futures

### Backend (Supabase recommandé)
- Authentification utilisateurs
- Base de données pour les courses
- Système de géolocalisation en temps réel
- Notifications push
- Système de paiement intégré
- Historique des transactions

### Fonctionnalités additionnelles
- Chat entre client et chauffeur
- Évaluation et avis
- Programme de fidélité
- Support multi-langue (Français, Wolof)
- Mode hors ligne
- Partage de position en direct

## 📝 Notes importantes

### Paiements mobiles au Sénégal
L'application supporte les trois principaux services de paiement mobile :
- **Wave** - Le plus populaire
- **Orange Money (OM)** - Service d'Orange
- **Yass** - Service de la Poste

### Considérations légales
⚠️ Cette application est un prototype. Pour une utilisation en production :
- Obtenir les licences de transport nécessaires
- Conformité RGPD pour les données personnelles
- Intégration avec les API officielles de paiement
- Assurance transport
- Conditions générales d'utilisation

## 🔧 Développement

### Composants réutilisables créés
- `AppLogo` : Logo de l'application avec variantes
- `AppHeader` : En-tête personnalisable
- `BottomNav` : Navigation inférieure (client/chauffeur)
- `ActiveBookingBanner` : Bannière de réservation active pour clients
- `ActiveRideBanner` : Bannière de course active pour chauffeurs
- `PaymentSelector` : Sélecteur de mode de paiement
- `StatsCard` : Carte de statistiques
- `RideCard` : Carte de demande de course

### Contextes
- `AppContext` : Gestion globale de l'état utilisateur et des réservations/courses actives

### Utilitaires
- `formatCurrency()` : Formatage en CFA
- `formatPhoneNumber()` : Formatage numéros sénégalais
- `generateParcelSMS()` : Génération SMS destinataires
- `calculateDistance()` : Calcul distance entre villes
- `calculatePrice()` : Calcul prix estimé

## 🌍 Villes supportées
Dakar, Thiès, Saint-Louis, Kaolack, Ziguinchor, Mbour, Touba, Rufisque, Diourbel, Louga, Tambacounda, Kolda, Richard-Toll, Matam, Kédougou

---

**Version** : 1.1.0
**Dernière mise à jour** : 11 Novembre 2025