# Progression de la conversion vers React Native

## ✅ Composants convertis

### Composants communs
- ✅ **BottomNav.tsx** - Navigation inférieure convertie
- ✅ **AppHeader.tsx** - En-tête converti
- ✅ **ActiveBookingBanner.tsx** - Bannière de réservation active
- ✅ **ActiveRideBanner.tsx** - Bannière de course active

### Écrans Wallet
- ✅ **WalletScreen.tsx** - Écran principal du wallet

### Configuration
- ✅ **App.tsx** - Converti vers React Navigation avec toutes les routes
- ✅ **lib/constants.ts** - Wallet ajouté dans PAYMENT_METHODS
- ✅ **lib/types.ts** - Type PaymentMethod mis à jour
- ✅ **lib/navigation.ts** - Types de navigation créés

## 🔄 Écrans à convertir

### Écrans Wallet (priorité haute)
- [ ] **PinCodeSetup.tsx** - Configuration du code PIN
- [ ] **PinCodeVerification.tsx** - Vérification du code PIN
- [ ] **DepositScreen.tsx** - Dépôt d'argent
- [ ] **WithdrawScreen.tsx** - Retrait d'argent
- [ ] **TransferScreen.tsx** - Transfert entre utilisateurs
- [ ] **TransactionHistory.tsx** - Historique des transactions

### Écrans principaux
- [ ] **ClientDashboard.tsx** - Tableau de bord client
- [ ] **DriverDashboard.tsx** - Tableau de bord chauffeur
- [ ] **WaitingScreen.tsx** - Attente de chauffeur
- [ ] **RideTracking.tsx** - Suivi de course
- [ ] **DriverNavigation.tsx** - Navigation chauffeur
- [ ] **DriverEarnings.tsx** - Gains chauffeur
- [ ] **ProfileScreen.tsx** - Profil utilisateur
- [ ] **InfoScreen.tsx** - Informations

### Écrans d'authentification
- [ ] **SplashScreen.tsx** - Écran de démarrage
- [ ] **LoginScreen.tsx** - Connexion
- [ ] **SelectionScreen.tsx** - Sélection client/chauffeur
- [ ] **ClientRegistration.tsx** - Inscription client
- [ ] **DriverRegistration.tsx** - Inscription chauffeur

### Composants UI
- [ ] **PaymentSelector.tsx** - Sélecteur de paiement
- [ ] **AppLogo.tsx** - Logo de l'application
- [ ] **WalletProtected.tsx** - HOC de protection wallet

## 📋 Patterns de conversion

### 1. Remplacement des imports

**Avant (Web) :**
```typescript
import { useNavigate } from 'react-router-dom';
import { Home, User } from 'lucide-react';
```

**Après (React Native) :**
```typescript
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../../lib/navigation';
```

### 2. Navigation

**Avant :**
```typescript
const navigate = useNavigate();
navigate('/wallet');
```

**Après :**
```typescript
const navigation = useNavigation<NavigationProp<'Wallet'>>();
navigation.navigate('Wallet' as any);
```

### 3. Éléments HTML → React Native

| Web | React Native |
|-----|-------------|
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |

### 4. Styles

**Avant (Tailwind) :**
```tsx
<div className="flex items-center gap-3 bg-white p-4 rounded-xl">
```

**Après (StyleSheet) :**
```tsx
<View style={styles.container}>
```

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
  },
});
```

### 5. Icônes

**Avant (Lucide) :**
```tsx
<Home className="w-6 h-6" />
```

**Après (Ionicons) :**
```tsx
<Ionicons name="home" size={24} color="#1f2937" />
```

### 6. ScrollView

**Avant :**
```tsx
<div className="overflow-y-auto">
```

**Après :**
```tsx
<ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
```

## 🛠️ Commandes utiles

### Installer expo-linear-gradient (optionnel)
```bash
npx expo install expo-linear-gradient
```

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

## 📝 Notes importantes

1. **Gap property** : React Native ne supporte pas `gap` directement. Utilisez `margin` ou des wrappers.

2. **Position fixed** : Utilisez `position: 'absolute'` avec les propriétés `top`, `bottom`, `left`, `right`.

3. **Shadows** : Utilisez `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` pour iOS et `elevation` pour Android.

4. **Colors** : Utilisez des valeurs hexadécimales (`#facc15`) au lieu de classes Tailwind.

5. **Typography** : Utilisez `fontSize`, `fontWeight` au lieu de classes Tailwind.

## 🎯 Prochaines étapes

1. Convertir les écrans wallet restants (priorité)
2. Convertir ClientDashboard et DriverDashboard
3. Convertir les écrans d'authentification
4. Tester chaque écran après conversion
5. Corriger les erreurs TypeScript
6. Tester sur appareil réel

