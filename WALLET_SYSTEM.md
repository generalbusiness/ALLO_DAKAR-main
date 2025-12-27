# Système Wallet - Allô Dakar

## Vue d'ensemble

Le système Wallet permet aux utilisateurs (clients et chauffeurs) de gérer leur argent directement dans l'application Allô Dakar. Il offre des fonctionnalités complètes de dépôt, retrait et transfert entre utilisateurs.

## Fonctionnalités principales

### 1. Code PIN de sécurité
- **Code à 4 chiffres** requis pour accéder au wallet
- Configuration lors de la première utilisation
- Vérification à chaque accès au wallet
- Protection contre les accès non autorisés (max 3 tentatives)

### 2. Dépôt d'argent
- Intégration avec les services Mobile Money :
  - 🌊 Wave
  - 🍊 Orange Money
  - 💚 Yass
- Montants rapides prédéfinis
- Confirmation instantanée
- Montant minimum : 500 FCFA
- Montant maximum : 1 000 000 FCFA

### 3. Retrait d'argent
- Vers les comptes Mobile Money
- Retrait total ou partiel du solde
- Traitement instantané
- Montant minimum : 500 FCFA

### 4. Transfert entre utilisateurs
- **Gratuit** entre utilisateurs Allô Dakar
- Recherche par nom ou numéro de téléphone
- Message optionnel
- Instantané
- Montant minimum : 100 FCFA

### 5. Historique des transactions
- Liste complète de toutes les transactions
- Filtres par type (dépôt, retrait, transfert, paiement, gain)
- Recherche par description
- Détails de chaque transaction (référence, méthode, statut)

## Structure des composants

### Écrans principaux

1. **WalletScreen** (`/wallet`)
   - Affichage du solde
   - Actions rapides (Dépôt, Retrait, Transfert)
   - Transactions récentes
   - Visibilité du solde (bouton œil)

2. **PinCodeSetup** (`/wallet/setup-pin`)
   - Configuration initiale du code PIN
   - Confirmation du code
   - Conseils de sécurité

3. **PinCodeVerification** (`/wallet/verify-pin`)
   - Saisie du code PIN
   - 3 tentatives maximum
   - Redirection sécurisée

4. **DepositScreen** (`/wallet/deposit`)
   - Choix du service Mobile Money
   - Saisie du numéro de téléphone
   - Montants rapides
   - Confirmation

5. **WithdrawScreen** (`/wallet/withdraw`)
   - Choix du service Mobile Money
   - Vérification du solde disponible
   - Option "Retirer tout"

6. **TransferScreen** (`/wallet/transfer`)
   - Recherche d'utilisateur
   - Saisie du montant
   - Message optionnel
   - Transfert gratuit

7. **TransactionHistory** (`/wallet/history`)
   - Liste complète des transactions
   - Filtres multiples
   - Recherche
   - Groupement par date

### Composants réutilisables

- **PinInput** : Composant de saisie de code PIN à 4 chiffres
- **WalletProtected** : HOC pour protéger les routes du wallet avec le PIN

## Intégration

### Dans AppContext

```typescript
interface WalletData {
  balance: number;
  hasPinCode: boolean;
  pinCode?: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out' | 'payment' | 'earning';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  method?: 'wave' | 'orange_money' | 'yass' | 'wallet';
  reference?: string;
  from?: string;
  to?: string;
}
```

### Dans AppHeader

Bouton Wallet affiché en permanence avec :
- Icône Wallet
- Solde actuel
- Accès direct (avec vérification PIN si configuré)

### Dans BottomNav

Nouvel onglet "Wallet" pour :
- Clients : Accueil | Wallet | Info | Profil
- Chauffeurs : Courses | Wallet | Gains | Profil

### Dans les formulaires de réservation

Option "💰 Wallet" ajoutée comme mode de paiement dans :
- Formulaire Voyager
- Formulaire Yobanté (Colis)

## Modèle économique

### Commission de 5%
- Appliquée sur chaque paiement de course (Voyager et Yobanté)
- Prélevée automatiquement lors du paiement
- Visible dans l'historique des transactions

### Transferts gratuits
- 0% de commission sur les transferts entre utilisateurs
- Encourage l'utilisation du wallet
- Fidélisation des utilisateurs

## Sécurité

### Code PIN
- Stockage sécurisé (en production : hashé)
- Vérification à chaque accès sensible
- Limite de 3 tentatives
- Option "Code PIN oublié" (à implémenter)

### Transactions
- Vérification du solde avant chaque transaction
- Références uniques pour chaque opération
- Statuts de transaction (pending, completed, failed)
- Historique complet et traçable

## UX/UI

### Design cohérent
- Couleur primaire : Jaune vif (#facc15)
- Textes : Gris foncé (#1f2937)
- Cards arrondies avec ombres subtiles
- Transitions fluides

### Feedback utilisateur
- Toasts pour les confirmations
- Animations de chargement
- Messages d'erreur clairs
- États visuels distincts

### Accessibilité
- Taille de police adaptée
- Contraste suffisant
- Zones de touch optimisées
- Support du collage pour le PIN

## Évolutions futures

### Phase 2
- [ ] Historique exportable (PDF, CSV)
- [ ] Notifications push pour les transactions
- [ ] Limite de retrait journalière configurable
- [ ] Programme de cashback

### Phase 3
- [ ] Paiement récurrent automatique
- [ ] Wallet partagé (famille)
- [ ] Cartes virtuelles
- [ ] Intégration bancaire

## Notes techniques

### Simulation
- Les appels API sont simulés avec `setTimeout`
- Les données sont stockées en mémoire (Context)
- En production : intégrer avec un backend réel

### Performance
- Lazy loading des écrans
- Optimisation des re-renders
- Mise en cache des données utilisateur

### Tests
- Tests unitaires des composants
- Tests d'intégration du flux complet
- Tests de sécurité du PIN
- Tests de performance
