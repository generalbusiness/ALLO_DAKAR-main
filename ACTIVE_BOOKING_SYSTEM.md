# Système de Gestion des Réservations/Courses Actives

## Vue d'ensemble

Ce document explique le nouveau système de gestion des réservations actives pour l'application Allô Dakar, permettant aux utilisateurs (clients et chauffeurs) de naviguer librement entre les différentes pages tout en conservant l'accès à leur réservation ou course en cours.

## Architecture

### Context API (AppContext)

Le système utilise le Context API de React pour gérer l'état global des réservations/courses actives :

```typescript
interface ActiveBooking {
  id: string;
  type: 'voyage' | 'colis';
  status: 'waiting' | 'accepted' | 'in_progress';
  data?: any;
}
```

#### États gérés :
- `activeBooking`: Réservation active du client (null si aucune)
- `activeRide`: Course active du chauffeur (null si aucune)

#### Fonctions disponibles :
- `setActiveBooking(booking | null)`: Définir ou effacer la réservation active
- `setActiveRide(ride | null)`: Définir ou effacer la course active

## Fonctionnalités - Interface Client

### 1. Bannière de réservation active (ActiveBookingBanner)

**Localisation** : Page d'accueil (ClientDashboard), au-dessus des onglets Voyager/Yobanté

**Affichage** :
- S'affiche automatiquement quand une réservation est créée
- Indique le type de service (Voyage ou Colis Yobanté)
- Affiche le statut actuel :
  - "En attente de confirmation" (jaune)
  - "Course acceptée" (vert)
  - "En cours" (vert)

**Actions** :
- Bouton "Voir le statut" : Redirige vers la page appropriée
  - Si status = "waiting" → /client/waiting
  - Si status = "accepted" ou "in_progress" → /client/tracking

### 2. Flux de réservation

#### Création (ClientDashboard)
1. Client remplit le formulaire (Voyager ou Yobanté)
2. Soumission du formulaire → Création de activeBooking
3. Navigation automatique vers /client/waiting

#### Attente (WaitingScreen)
- Affiche un loader pendant la recherche du chauffeur
- Bouton "Retour à l'accueil" : permet de revenir sans annuler
- Bouton "Annuler la demande" : AlertDialog de confirmation
  - Annulation → activeBooking = null
- Après 3 secondes : status passe à "accepted"
- Bouton "Cliquez pour voir" : Navigation vers /client/tracking

#### Suivi (RideTracking)
- Bouton retour (flèche) : retour à l'accueil
- Affiche la carte et les informations du chauffeur
- Bouton "Terminer la course" : activeBooking = null
- Bouton "Annuler la course" : AlertDialog de confirmation
  - Annulation → activeBooking = null

### 3. Navigation libre

Le client peut :
- Soumettre une réservation → Voir la page d'attente
- Retourner à l'accueil → Voir la bannière de réservation active
- Cliquer sur "Voir le statut" → Retourner au suivi
- Naviguer entre les pages librement sans perdre sa réservation

## Fonctionnalités - Interface Chauffeur

### 1. Bannière de course active (ActiveRideBanner)

**Localisation** : Page d'accueil (DriverDashboard), au-dessus de "Demandes de courses"

**Affichage** :
- S'affiche automatiquement quand une course est acceptée
- Indique le type de course (Transport passager ou Livraison colis)
- Affiche le statut :
  - "Course acceptée - En route" (vert)
  - "Course en cours" (vert)

**Actions** :
- Bouton "Voir le statut" : Redirige vers /driver/navigation

### 2. Flux de course

#### Acceptation (DriverDashboard)
1. Chauffeur voit la liste des demandes de courses
2. Clique sur "Accepter" → Création de activeRide
3. Navigation automatique vers /driver/navigation

#### Navigation (DriverNavigation)
- Bouton retour (flèche) : retour à l'accueil
- Affiche la carte et les détails de la course
- Bouton "Démarrer la course" : status passe à "in_progress"
- Bouton téléphone : appeler le client
- Bouton "Annuler la course" : AlertDialog de confirmation
  - Annulation → activeRide = null

### 3. Navigation libre

Le chauffeur peut :
- Accepter une course → Voir la page de navigation
- Retourner à l'accueil → Voir la bannière de course active
- Cliquer sur "Voir le statut" → Retourner à la navigation
- Naviguer entre les pages librement sans perdre sa course

## Design & Style

### Couleurs

Les bannières respectent la charte graphique de l'application :
- **Jaune primaire** : `#facc15` (boutons, icônes de fond)
- **Gris foncé** : `#1f2937` (textes principaux)
- **Fond jaune** : `bg-yellow-50` (statut "waiting")
- **Fond vert** : `bg-green-50` (statut "accepted" ou "in_progress")

### Layout

Les bannières utilisent :
- Coins arrondis : `rounded-xl`
- Bordure : `border-2`
- Ombre : `shadow-sm`
- Padding : `p-4`
- Margin bottom : `mb-6`

### Responsive

Les bannières sont complètement responsives :
- Icône fixe (40x40px)
- Texte flexible avec `flex-1` et `truncate`
- Bouton avec taille fixe `flex-shrink-0`

## Dialogues de confirmation

Tous les boutons d'annulation utilisent le composant `AlertDialog` de shadcn/ui :
- Titre clair
- Description explicative
- Bouton "Non, continuer" (annuler le dialogue)
- Bouton "Oui, annuler" (confirmer l'action, style destructif rouge)

## État persistant

Les états `activeBooking` et `activeRide` sont conservés :
- Pendant toute la navigation dans l'application
- Jusqu'à ce que l'utilisateur annule ou termine la course
- Jusqu'à la déconnexion (logout efface les états)

## Évolutions futures possibles

1. **Persistance locale** : Sauvegarder dans localStorage pour survivre au refresh
2. **Notifications** : Alertes push quand le statut change
3. **Historique** : Garder un historique des courses passées
4. **Multi-courses** : Permettre plusieurs courses simultanées (pour chauffeurs)
5. **Synchronisation backend** : Connecter à une vraie API pour sync en temps réel
