// Brand colors
export const COLORS = {
    primary: '#facc15', // Jaune vif Allô Dakar
    primaryHover: '#fcd34d',
    dark: '#1f2937', // Gris foncé pour les textes
    lightGray: '#f9fafb',
    mediumGray: '#6b7280',
} as const;

// Payment methods
export const PAYMENT_METHODS = [
    { id: 'wallet', label: 'Wallet' },
    { id: 'wave', label: 'Wave' },
    { id: 'om', label: 'OM' },
    { id: 'yass', label: 'Yass' },
] as const;

// Cities in Senegal for autocomplete
export const SENEGAL_CITIES = [
    'Dakar',
    'Thiès',
    'Saint-Louis',
    'Kaolack',
    'Ziguinchor',
    'Mbour',
    'Touba',
    'Rufisque',
    'Diourbel',
    'Louga',
    'Tambacounda',
    'Kolda',
    'Richard-Toll',
    'Matam',
    'Kédougou',
] as const;

// App routes
export const ROUTES = {
    splash: '/',
    login: '/login',
    selection: '/selection',
    registerClient: '/register/client',
    registerDriver: '/register/driver',
    clientDashboard: '/client/dashboard',
    clientWaiting: '/client/waiting',
    clientTracking: '/client/tracking',
    driverDashboard: '/driver/dashboard',
    driverEarnings: '/driver/earnings',
    driverNavigation: '/driver/navigation',
    profile: '/profile',
    info: '/info',
} as const;
