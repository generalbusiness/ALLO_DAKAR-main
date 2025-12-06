# Guide de développement - Allô Dakar

## 🎯 Principes de développement

### 1. Structure du code
- **Composants réutilisables** : Tous les composants UI communs sont dans `/components/common`
- **Écrans** : Les pages complètes sont dans `/components/screens`
- **Types centralisés** : Tous les types TypeScript dans `/lib/types.ts`
- **Constantes** : Valeurs réutilisables dans `/lib/constants.ts`
- **Utilitaires** : Fonctions helpers dans `/lib/utils-custom.ts`

### 2. Conventions de nommage

#### Fichiers
- Composants React : `PascalCase.tsx` (ex: `AppHeader.tsx`)
- Utilitaires : `kebab-case.ts` (ex: `utils-custom.ts`)
- Types : `types.ts`

#### Composants
```tsx
// ✅ Bon
export default function ClientDashboard() { }

// ❌ Éviter
export default function clientDashboard() { }
```

#### Variables et fonctions
```tsx
// ✅ Bon
const [activeTab, setActiveTab] = useState('voyager');
const handleVoyageSubmit = (e: React.FormEvent) => { };

// ❌ Éviter
const [ActiveTab, SetActiveTab] = useState('voyager');
const HandleVoyageSubmit = (e: React.FormEvent) => { };
```

### 3. Gestion des couleurs

**Toujours utiliser les couleurs de la charte graphique :**

```tsx
// ✅ Bon - Utiliser les couleurs exactes
className="bg-[#facc15] text-[#1f2937]"

// Ou utiliser les constantes
import { COLORS } from '../../lib/constants';
style={{ backgroundColor: COLORS.primary }}

// ❌ Éviter - Utiliser des classes Tailwind génériques
className="bg-yellow-400 text-gray-900"
```

**Couleurs de la marque :**
- Primaire : `#facc15` (jaune vif)
- Primaire hover : `#fcd34d`
- Texte sombre : `#1f2937`
- Fond clair : `#f9fafb`
- Texte secondaire : `#6b7280`

### 4. Components réutilisables disponibles

#### AppLogo
```tsx
import AppLogo from '../common/AppLogo';

<AppLogo size="md" variant="default" />
// size: 'sm' | 'md' | 'lg' | 'xl'
// variant: 'default' | 'dark'
```

#### AppHeader
```tsx
import AppHeader from '../common/AppHeader';

<AppHeader 
  title="Allô Dakar" 
  subtitle="Bienvenue"
  variant="light"
/>
// variant: 'light' | 'dark'
```

#### BottomNav
```tsx
import BottomNav from '../common/BottomNav';

<BottomNav userType="client" />
// userType: 'client' | 'driver'
```

#### PaymentSelector
```tsx
import PaymentSelector from '../common/PaymentSelector';

<PaymentSelector 
  selected={paymentMethod}
  onChange={(method) => setPaymentMethod(method)}
/>
```

#### StatsCard
```tsx
import StatsCard from '../common/StatsCard';

<StatsCard 
  label="Courses du jour" 
  value="3"
  variant="dark"
/>
// variant: 'default' | 'dark'
```

#### RideCard
```tsx
import RideCard from '../common/RideCard';

<RideCard 
  request={rideRequest}
  onAccept={(id) => handleAccept(id)}
  showAcceptButton={true}
/>
```

### 5. Gestion d'état

#### Context API
```tsx
import { useApp } from '../../contexts/AppContext';

function MyComponent() {
  const { user, isLoggedIn, login, logout } = useApp();
  
  // Utilisation...
}
```

#### State local
```tsx
// Pour les formulaires
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

// Update partiel
setFormData({ ...formData, field1: 'nouvelle valeur' });
```

### 6. Navigation

```tsx
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constants';

function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(ROUTES.clientDashboard);
  };
}
```

### 7. Types TypeScript

**Toujours typer les props des composants :**

```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onSubmit: (data: FormData) => void;
  optional?: boolean;
}

export default function MyComponent({ 
  title, 
  count, 
  onSubmit,
  optional = false 
}: MyComponentProps) {
  // ...
}
```

**Utiliser les types définis :**

```tsx
import type { UserType, PaymentMethod, RideRequest } from '../../lib/types';

const userType: UserType = 'client';
const payment: PaymentMethod = 'wave';
```

### 8. Utilitaires disponibles

```tsx
import { 
  formatCurrency,
  formatPhoneNumber,
  generateParcelSMS,
  calculateDistance,
  calculatePrice,
  validatePhoneNumber,
  generateId 
} from '../../lib/utils-custom';

// Formatage monétaire
const price = formatCurrency(15000); // "15 000 F"

// Formatage téléphone
const phone = formatPhoneNumber('771234567'); // "+221 77 123 45 67"

// Génération SMS
const sms = generateParcelSMS('Fatou', 'Amadou'); 
// "Bonjour Fatou, vous allez recevoir un colis via Allô Dakar de la part de Amadou..."

// Calcul distance
const distance = calculateDistance('Dakar', 'Saint-Louis'); // en km

// Calcul prix
const estimatedPrice = calculatePrice(250, 'voyage', 2); // distance, type, sièges

// Validation téléphone
const isValid = validatePhoneNumber('771234567'); // true/false

// Génération ID unique
const id = generateId(); // "1699876543210-abc123def"
```

### 9. Styling avec Tailwind

**Classes couramment utilisées :**

```tsx
// Boutons primaires
className="w-full bg-[#facc15] text-[#1f2937] hover:bg-[#fcd34d] h-14 rounded-xl shadow-md"

// Cartes
className="p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow"

// Inputs
className="h-12 rounded-xl"

// Conteneurs de page
className="flex flex-col min-h-screen bg-gray-50"

// Zone de contenu avec navigation fixe en bas
className="flex-1 overflow-y-auto p-6 pb-24"
```

### 10. Bonnes pratiques

#### ✅ À faire
- Utiliser les composants réutilisables
- Typer tous les props et variables
- Utiliser les constantes pour les valeurs fixes
- Commenter le code complexe
- Gérer les cas d'erreur
- Rendre les composants accessibles (labels, aria-*)

#### ❌ À éviter
- Dupliquer du code
- Utiliser `any` en TypeScript
- Hardcoder des valeurs (couleurs, textes, etc.)
- Créer des composants trop complexes
- Oublier les keys dans les listes

### 11. Formulaires

**Structure recommandée :**

```tsx
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Validation
  // Soumission
};

const handleChange = (field: string, value: string) => {
  setFormData({ ...formData, [field]: value });
};

return (
  <form onSubmit={handleSubmit} className="space-y-5">
    <div className="space-y-2">
      <Label htmlFor="field1">Label</Label>
      <Input
        id="field1"
        value={formData.field1}
        onChange={(e) => handleChange('field1', e.target.value)}
        className="h-12 rounded-xl"
      />
    </div>
    {/* ... autres champs ... */}
    <Button type="submit" className="w-full ...">
      Soumettre
    </Button>
  </form>
);
```

### 12. Performance

**Optimisations recommandées :**

```tsx
// Utiliser useCallback pour les fonctions passées en props
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Utiliser useMemo pour les calculs coûteux
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);

// Lazy loading pour les routes
const ClientDashboard = lazy(() => import('./screens/ClientDashboard'));
```

### 13. Tests (à implémenter)

```tsx
// Structure de test recommandée
describe('ClientDashboard', () => {
  it('should render voyage form', () => {
    // Test
  });
  
  it('should submit form correctly', () => {
    // Test
  });
});
```

## 🔧 Commandes utiles

```bash
# Démarrage du projet
npm run dev

# Build de production
npm run build

# Linter
npm run lint

# Type checking
npm run type-check
```

## 📝 Checklist avant commit

- [ ] Code formaté correctement
- [ ] Pas d'erreurs TypeScript
- [ ] Pas de console.log en production
- [ ] Composants testés manuellement
- [ ] Documentation mise à jour si nécessaire
- [ ] Couleurs de marque respectées
- [ ] Responsive testé

## 🚀 Prochaines étapes

1. **Intégration backend Supabase**
   - Configuration de la base de données
   - Authentification
   - API en temps réel

2. **Géolocalisation**
   - Intégration Google Maps
   - Suivi en temps réel

3. **Paiements**
   - Intégration Wave API
   - Intégration Orange Money
   - Intégration Yass

4. **Tests**
   - Tests unitaires avec Jest
   - Tests d'intégration
   - Tests E2E avec Cypress

5. **Déploiement**
   - CI/CD
   - Hosting
   - Monitoring

---

**Maintenu par l'équipe Allô Dakar**
