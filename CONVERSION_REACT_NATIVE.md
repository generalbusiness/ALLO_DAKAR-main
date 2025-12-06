# Guide de conversion vers React Native

## État actuel

L'application utilise actuellement :
- **React Router** (web) dans App.tsx et les composants
- **Classes Tailwind CSS** (web)
- **Éléments HTML** (div, button, etc.)

## Modifications effectuées

✅ **App.tsx** : Converti vers React Navigation
✅ **lib/constants.ts** : Wallet ajouté dans PAYMENT_METHODS
✅ **lib/navigation.ts** : Types de navigation créés

## Modifications nécessaires

### 1. Composants à convertir

Tous les composants qui utilisent `useNavigate` de `react-router-dom` doivent être convertis vers `useNavigation` de `@react-navigation/native`.

**Fichiers à modifier :**
- `components/screens/WalletScreen.tsx`
- `components/screens/DepositScreen.tsx`
- `components/screens/WithdrawScreen.tsx`
- `components/screens/TransferScreen.tsx`
- `components/screens/PinCodeSetup.tsx`
- `components/screens/PinCodeVerification.tsx`
- `components/screens/TransactionHistory.tsx`
- `components/common/BottomNav.tsx`
- `components/common/AppHeader.tsx`
- `components/common/ActiveBookingBanner.tsx`
- `components/common/ActiveRideBanner.tsx`
- `components/screens/ClientDashboard.tsx`
- `components/screens/DriverDashboard.tsx`
- Et tous les autres écrans...

### 2. Remplacement des imports

**Avant :**
```typescript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/wallet');
```

**Après :**
```typescript
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../lib/navigation';

const navigation = useNavigation<NavigationProp<'Wallet'>>();
navigation.navigate('Wallet');
```

### 3. Remplacement des éléments HTML par React Native

**Avant (Web) :**
```tsx
<div className="...">
  <button onClick={...}>Click</button>
</div>
```

**Après (React Native) :**
```tsx
import { View, TouchableOpacity, Text } from 'react-native';

<View style={...}>
  <TouchableOpacity onPress={...}>
    <Text>Click</Text>
  </TouchableOpacity>
</View>
```

### 4. Remplacement de Tailwind CSS par StyleSheet

**Option A : Utiliser NativeWind** (recommandé si vous voulez garder Tailwind)
```bash
npm install nativewind
```

**Option B : Utiliser StyleSheet de React Native**
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
```

### 5. Routes wallet dans React Navigation

Les routes wallet sont maintenant configurées dans App.tsx :
- `Wallet` → `/wallet`
- `PinCodeSetup` → `/wallet/setup-pin`
- `PinCodeVerification` → `/wallet/verify-pin`
- `Deposit` → `/wallet/deposit`
- `Withdraw` → `/wallet/withdraw`
- `Transfer` → `/wallet/transfer`
- `TransactionHistory` → `/wallet/history`

### 6. Navigation avec paramètres

**Exemple pour PinCodeVerification :**
```typescript
navigation.navigate('PinCodeVerification', { from: 'Wallet' });
```

## Prochaines étapes

1. Installer NativeWind si vous voulez garder Tailwind :
   ```bash
   npm install nativewind
   ```

2. Convertir tous les composants un par un :
   - Remplacer `useNavigate` par `useNavigation`
   - Remplacer les éléments HTML par des composants React Native
   - Adapter les styles

3. Tester chaque écran après conversion

## Notes importantes

- Les composants shadcn/ui ne fonctionnent pas directement en React Native
- Il faudra créer des versions React Native des composants UI
- Les icônes `lucide-react` doivent être remplacées par `@expo/vector-icons` ou `react-native-vector-icons`

