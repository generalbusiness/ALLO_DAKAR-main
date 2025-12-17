import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './contexts/AppContext';
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import SelectionScreen from './components/screens/SelectionScreen';
import ClientRegistration from './components/screens/ClientRegistration';
import DriverRegistration from './components/screens/DriverRegistration';
import ClientDashboard from './components/screens/ClientDashboard';
import WaitingScreen from './components/screens/WaitingScreen';
import RideTracking from './components/screens/RideTracking';
import DriverDashboard from './components/screens/DriverDashboard';
import DriverEarnings from './components/screens/DriverEarnings';
import DriverNavigation from './components/screens/DriverNavigation';
import ProfileScreen from './components/screens/ProfileScreen';
import InfoScreen from './components/screens/InfoScreen';
import WalletScreen from './components/screens/WalletScreen';
import PinCodeSetup from './components/screens/PinCodeSetup';
import PinCodeVerification from './components/screens/PinCodeVerification';
import DepositScreen from './components/screens/DepositScreen';
import WithdrawScreen from './components/screens/WithdrawScreen';
import TransferScreen from './components/screens/TransferScreen';
import TransactionHistory from './components/screens/TransactionHistory';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Selection: undefined;
  ClientRegistration: undefined;
  DriverRegistration: undefined;
  ClientDashboard: undefined;
  Waiting: undefined;
  RideTracking: undefined;
  DriverDashboard: undefined;
  DriverEarnings: undefined;
  DriverNavigation: undefined;
  Profile: undefined;
  Info: undefined;
  Wallet: undefined;
  PinCodeSetup: undefined;
  PinCodeVerification: { from?: string };
  Deposit: undefined;
  Withdraw: undefined;
  Transfer: undefined;
  TransactionHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [userType, setUserType] = useState<'client' | 'driver' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Selection" component={SelectionScreen} />
            <Stack.Screen name="ClientRegistration">
              {(props) => <ClientRegistration {...props} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="DriverRegistration">
              {(props) => <DriverRegistration {...props} setUserType={setUserType} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
            <Stack.Screen name="Waiting" component={WaitingScreen} />
            <Stack.Screen name="RideTracking" component={RideTracking} />
            <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
            <Stack.Screen name="DriverEarnings" component={DriverEarnings} />
            <Stack.Screen name="DriverNavigation" component={DriverNavigation} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} userType={userType} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Info" component={InfoScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="PinCodeSetup" component={PinCodeSetup} />
            <Stack.Screen name="PinCodeVerification" component={PinCodeVerification} />
            <Stack.Screen name="Deposit" component={DepositScreen} />
            <Stack.Screen name="Withdraw" component={WithdrawScreen} />
            <Stack.Screen name="Transfer" component={TransferScreen} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}