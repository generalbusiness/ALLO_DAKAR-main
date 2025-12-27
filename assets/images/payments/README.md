# Images de paiement

Placez ici les logos/images des méthodes de paiement.

## Méthodes de paiement supportées
- Wallet (Allô Dakar)
- Wave
- Orange Money (OM)
- Yass

## Formats recommandés
- PNG avec transparence
- Formats : `.png`, `.jpg`

## Tailles recommandées
- 200x200px ou 300x300px pour une bonne qualité
- Format carré recommandé

## Noms de fichiers suggérés
- `wallet.png` - Logo Wallet Allô Dakar
- `wave.png` - Logo Wave
- `orange-money.png` ou `om.png` - Logo Orange Money
- `yass.png` - Logo Yass

## Utilisation dans le code

```typescript
import waveLogo from '../../assets/images/payments/wave.png';
import omLogo from '../../assets/images/payments/orange-money.png';
import yassLogo from '../../assets/images/payments/yass.png';

// Dans un composant
<Image source={waveLogo} style={styles.paymentLogo} />
```

