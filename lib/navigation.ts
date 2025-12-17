import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

// Navigation prop types
export type NavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
export type RouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

