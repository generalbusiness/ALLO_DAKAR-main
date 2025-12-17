import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'client' | 'driver';
}

// Active booking/ride state
interface ActiveBooking {
  id: string;
  type: 'voyage' | 'colis';
  status: 'waiting' | 'accepted' | 'in_progress';
  data?: any;
}

// Wallet state
interface WalletData {
  balance: number;
  hasPinCode: boolean;
  pinCode?: string; // In production, this would be hashed
}

// Transaction interface
export interface Transaction {
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

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  // Client booking management
  activeBooking: ActiveBooking | null;
  setActiveBooking: (booking: ActiveBooking | null) => void;
  // Driver ride management
  activeRide: ActiveBooking | null;
  setActiveRide: (ride: ActiveBooking | null) => void;
  // Wallet management
  walletData: WalletData;
  updateWalletBalance: (amount: number) => void;
  setPinCode: (pin: string) => void;
  verifyPinCode: (pin: string) => boolean;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [activeRide, setActiveRide] = useState<ActiveBooking | null>(null);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 25000, // Initial balance for demo
    hasPinCode: false,
    pinCode: undefined,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 25000,
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'completed',
      description: 'Dépôt via Wave',
      method: 'wave',
      reference: 'WAV-2024-001'
    },
  ]);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setActiveBooking(null);
    setActiveRide(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const updateWalletBalance = (amount: number) => {
    setWalletData(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  const setPinCode = (pin: string) => {
    setWalletData(prev => ({
      ...prev,
      hasPinCode: true,
      pinCode: pin
    }));
  };

  const verifyPinCode = (pin: string): boolean => {
    return walletData.pinCode === pin;
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      isLoggedIn, 
      login, 
      logout, 
      updateUser,
      activeBooking,
      setActiveBooking,
      activeRide,
      setActiveRide,
      walletData,
      updateWalletBalance,
      setPinCode,
      verifyPinCode,
      transactions,
      addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}