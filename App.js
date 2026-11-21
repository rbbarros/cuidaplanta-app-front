import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import ListaScreen from './src/screens/ListaScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import MapaScreen from './src/screens/MapaScreen';
import IAScreen from './src/screens/IAScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: '#757575',
        }}
      >
        <Tab.Screen 
          name="Minhas Plantas" 
          component={ListaScreen} 
          options={{ tabBarIcon: () => <Text>🌿</Text> }}
        />
        <Tab.Screen 
          name="Cadastrar" 
          component={FormularioScreen} 
          options={{ tabBarIcon: () => <Text>📷</Text> }}
        />
        <Tab.Screen 
          name="Mapa" 
          component={MapaScreen} 
          options={{ tabBarIcon: () => <Text>🗺️</Text> }}
        />
        <Tab.Screen 
          name="Guia IA" 
          component={IAScreen} 
          options={{ tabBarIcon: () => <Text>🤖</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
