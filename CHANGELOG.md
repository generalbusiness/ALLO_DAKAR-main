# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.1.0] - 2025-11-11

### ✨ Nouveautés

#### Système de gestion des réservations/courses actives
- **ActiveBookingBanner** : Nouveau composant pour afficher l'état des réservations clients
  - Affichage automatique sur la page d'accueil quand une réservation existe
  - Statuts visuels : En attente (jaune), Acceptée (vert), En cours (vert)
  - Bouton "Voir le statut" pour navigation rapide vers le suivi
  
- **ActiveRideBanner** : Nouveau composant pour afficher l'état des courses chauffeurs
  - Affichage automatique sur la page d'accueil quand une course est acceptée
  - Statuts visuels : Acceptée (vert), En cours (vert)
  - Bouton "Voir le statut" pour navigation rapide vers la page de navigation

#### Navigation fluide
- Les clients peuvent maintenant naviguer librement entre l'accueil et le suivi de leur réservation
- Les chauffeurs peuvent naviguer entre l'accueil et la page de navigation de leur course active
- Les états sont préservés pendant toute la session

#### Gestion améliorée de l'annulation
- Dialogues de confirmation (AlertDialog) pour toutes les annulations
- Messages clairs et explicites
- Boutons d'annulation visibles à tous les stades du processus

### 🔄 Modifications

#### AppContext
- Ajout de `activeBooking` : État de la réservation active du client
- Ajout de `activeRide` : État de la course active du chauffeur
- Ajout de `setActiveBooking()` : Fonction pour gérer la réservation active
- Ajout de `setActiveRide()` : Fonction pour gérer la course active
- Le logout efface automatiquement les réservations/courses actives

#### ClientDashboard
- Intégration du système de réservation active
- Affichage de ActiveBookingBanner si une réservation existe
- Création automatique d'une réservation lors de la soumission du formulaire

#### WaitingScreen
- Mise à jour du statut de réservation à "accepted" après simulation
- Ajout du bouton "Annuler la demande" avec confirmation
- Bouton "Retour à l'accueil" pour navigation sans annulation

#### RideTracking
- Ajout du bouton "Retour" (flèche) vers l'accueil
- Ajout du bouton "Annuler la course" avec confirmation
- Bouton "Terminer la course" pour finaliser et effacer la réservation

#### DriverDashboard
- Intégration du système de course active
- Affichage de ActiveRideBanner si une course existe
- Création automatique d'une course lors de l'acceptation d'une demande

#### DriverNavigation
- Ajout du bouton "Retour" (flèche) vers l'accueil
- Ajout du bouton "Annuler la course" avec confirmation
- Bouton "Démarrer la course" met à jour le statut

### 📚 Documentation

- Nouveau fichier `ACTIVE_BOOKING_SYSTEM.md` : Documentation complète du système
- Mise à jour du `README.md` avec les nouvelles fonctionnalités
- Création du `CHANGELOG.md` pour le suivi des versions

### 🎨 Design

- Respect total de la charte graphique (#facc15 et #1f2937)
- Bannières avec coins arrondis et ombres subtiles
- Design responsive avec gestion du débordement de texte
- Cohérence visuelle entre les interfaces client et chauffeur

---

## [1.0.0] - 2025-11-10

### 🎉 Version initiale

#### Fonctionnalités principales
- Authentification utilisateur (Client/Chauffeur)
- Interface client avec réservation de voyages et envoi de colis
- Interface chauffeur avec gestion des demandes de courses
- Système de navigation avec React Router
- Design moderne avec Tailwind CSS et shadcn/ui

#### Composants créés
- AppLogo, AppHeader, BottomNav
- PaymentSelector, StatsCard, RideCard
- Écrans : SplashScreen, LoginScreen, ClientDashboard, DriverDashboard, etc.

#### Architecture
- Structure modulaire avec composants réutilisables
- Context API pour la gestion d'état
- TypeScript pour la sécurité des types
- Utilitaires personnalisés

---

**Format** : Ce changelog suit les principes de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
