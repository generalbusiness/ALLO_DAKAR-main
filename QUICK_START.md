# Guide de démarrage rapide - Allô Dakar

## 🚀 Installation et lancement

Cette application est prête à l'emploi dans Figma Make. Aucune installation supplémentaire n'est nécessaire.

## 📋 Navigation de base

### Flux utilisateur Client

1. **Écran d'accueil** (`/`) 
   - Splash screen avec le logo Allô Dakar
   - Redirection automatique vers la page de connexion

2. **Connexion/Inscription** (`/login`, `/register/client`)
   - Se connecter avec un compte existant
   - Ou créer un nouveau compte client

3. **Tableau de bord Client** (`/client/dashboard`)
   - Deux onglets : **Voyager** et **Yobanté (Colis)**
   - Remplir le formulaire de réservation
   - Choisir le mode de paiement (Wave, OM, Yass)
   - Valider la réservation

4. **Page d'attente** (`/client/waiting`)
   - Attendre qu'un chauffeur accepte la demande
   - Possibilité de retourner à l'accueil (la réservation reste active)
   - Possibilité d'annuler la demande

5. **Suivi de course** (`/client/tracking`)
   - Voir la carte avec la position du chauffeur
   - Informations du chauffeur et du véhicule
   - Possibilité d'appeler ou d'envoyer un message
   - Terminer ou annuler la course

### Flux utilisateur Chauffeur

1. **Écran d'accueil** (`/`)
   - Splash screen avec le logo

2. **Connexion/Inscription** (`/login`, `/register/driver`)
   - Se connecter avec un compte chauffeur
   - Ou créer un nouveau compte chauffeur

3. **Tableau de bord Chauffeur** (`/driver/dashboard`)
   - Voir les statistiques du jour (courses, gains)
   - Liste des demandes de courses disponibles
   - Accepter une course

4. **Navigation** (`/driver/navigation`)
   - Voir la carte avec l'itinéraire
   - Informations sur la destination et le client
   - Démarrer la course
   - Appeler le client
   - Annuler la course si nécessaire

5. **Gains** (`/driver/earnings`)
   - Voir les statistiques de gains (jour, semaine, mois)
   - Graphiques de performance

## 🎯 Fonctionnalités clés à tester

### ✅ Bannières de réservation/course active

**Pour les clients :**
1. Faire une réservation (Voyager ou Yobanté)
2. Sur la page d'attente, cliquer sur "Retour à l'accueil"
3. ✨ Une bannière apparaît au-dessus des onglets
4. Cliquer sur "Voir le statut" pour retourner au suivi

**Pour les chauffeurs :**
1. Accepter une course
2. Sur la page de navigation, cliquer sur la flèche retour
3. ✨ Une bannière apparaît au-dessus des demandes
4. Cliquer sur "Voir le statut" pour retourner à la navigation

### ✅ Annulation avec confirmation

**Trois points d'annulation :**
1. Sur la page d'attente (avant acceptation)
2. Sur la page de suivi client
3. Sur la page de navigation chauffeur

Chaque annulation affiche un dialogue de confirmation pour éviter les erreurs.

### ✅ Génération de SMS

**Pour les colis Yobanté :**
1. Aller sur l'onglet Yobanté
2. Remplir les informations du destinataire
3. Cliquer sur "Générer un SMS pour le destinataire"
4. Un message pré-formaté apparaît

## 🎨 Personnalisation

### Couleurs de la marque

Les couleurs sont définies dans `styles/globals.css` :
- Jaune primaire : `#facc15`
- Gris foncé : `#1f2937`

Pour changer les couleurs, modifier les valeurs dans le fichier CSS.

### Composants réutilisables

Les composants suivants peuvent être réutilisés dans d'autres parties de l'application :

```tsx
// Logo
import AppLogo from './components/common/AppLogo';
<AppLogo size="lg" showText />

// En-tête
import AppHeader from './components/common/AppHeader';
<AppHeader />

// Navigation inférieure
import BottomNav from './components/common/BottomNav';
<BottomNav userType="client" />

// Bannière de réservation
import ActiveBookingBanner from './components/common/ActiveBookingBanner';
<ActiveBookingBanner type="voyage" status="accepted" />

// Carte de statistiques
import StatsCard from './components/common/StatsCard';
<StatsCard label="Courses" value="15" variant="light" />
```

## 🔧 Gestion d'état

### Utiliser le contexte de l'application

```tsx
import { useApp } from './contexts/AppContext';

function MyComponent() {
  const { 
    user, 
    isLoggedIn, 
    activeBooking, 
    setActiveBooking,
    activeRide,
    setActiveRide 
  } = useApp();
  
  // Utiliser les états...
}
```

### États disponibles

- `user` : Informations de l'utilisateur connecté
- `isLoggedIn` : Booléen indiquant si l'utilisateur est connecté
- `activeBooking` : Réservation active du client (null si aucune)
- `activeRide` : Course active du chauffeur (null si aucune)

### Fonctions disponibles

- `login(user)` : Connecter un utilisateur
- `logout()` : Déconnecter et effacer les réservations/courses actives
- `setActiveBooking(booking | null)` : Créer ou effacer une réservation
- `setActiveRide(ride | null)` : Créer ou effacer une course

## 📱 Test des flux complets

### Test Client : Réserver un voyage

```
1. Aller sur /login
2. Cliquer sur "S'inscrire" (client)
3. Remplir le formulaire d'inscription
4. Cliquer sur "Créer mon compte"
   → Redirection vers /client/dashboard
5. Remplir le formulaire de voyage
   - Point de départ : Dakar
   - Point d'arrivée : Saint-Louis
   - Date et heure
   - Nombre de places : 2
6. Choisir un mode de paiement (Wave)
7. Cliquer sur "Valider la réservation"
   → Redirection vers /client/waiting
8. Attendre 3 secondes (simulation d'acceptation)
9. Cliquer sur "Cliquez pour voir"
   → Redirection vers /client/tracking
10. Tester le bouton retour pour voir la bannière
11. Cliquer sur "Terminer la course"
```

### Test Chauffeur : Accepter une course

```
1. Aller sur /login
2. Cliquer sur "S'inscrire" (chauffeur)
3. Remplir le formulaire d'inscription chauffeur
4. Cliquer sur "Créer mon compte"
   → Redirection vers /driver/dashboard
5. Voir les demandes de courses
6. Cliquer sur "Accepter" sur une course
   → Redirection vers /driver/navigation
7. Tester le bouton retour pour voir la bannière
8. Cliquer sur "Démarrer la course"
9. Tester l'annulation avec le bouton "Annuler"
```

## 🐛 Dépannage

### La bannière ne s'affiche pas
- Vérifier que vous avez bien créé une réservation/accepté une course
- Vérifier que vous êtes sur la page d'accueil (dashboard)

### Les états ne sont pas persistés
- C'est normal : les états sont perdus au refresh de la page
- Pour persister les données, implémenter localStorage ou connecter à un backend

### Les dialogues de confirmation ne s'affichent pas
- Vérifier que le composant AlertDialog est bien importé
- Vérifier la console pour d'éventuelles erreurs

## 📚 Documentation complémentaire

- **Architecture détaillée** : Voir `README.md`
- **Système de réservations actives** : Voir `ACTIVE_BOOKING_SYSTEM.md`
- **Guide de développement** : Voir `DEVELOPMENT.md`
- **Historique des modifications** : Voir `CHANGELOG.md`

## 💡 Prochaines étapes

1. **Tester tous les flux** : Client et Chauffeur
2. **Personnaliser le design** : Adapter aux besoins spécifiques
3. **Ajouter un backend** : Supabase recommandé pour la persistance
4. **Intégrer Google Maps** : Pour la vraie géolocalisation
5. **Ajouter les paiements** : Intégrer les API Wave, Orange Money, etc.

---

**Bon développement ! 🚀**
