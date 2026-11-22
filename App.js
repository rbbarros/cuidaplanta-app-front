// Navegação do aplicativo CuidaPlanta.
// Tabs (abas de baixo): Minhas Plantas | Mapa | IA
// Stack (dentro da aba Minhas Plantas): Lista -> Formulário

import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ListaScreen from './src/screens/ListaScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import MapaScreen from './src/screens/MapaScreen';
import IAScreen from './src/screens/IAScreen';
import { cores } from './src/styles/styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Aparência do cabeçalho, igual em todas as telas
const cabecalho = {
  headerStyle: { backgroundColor: cores.verde },
  headerTintColor: cores.branco,
};

// Stack: da lista o usuário entra no formulário para cadastrar e volta
function PlantasStack() {
  return (
    <Stack.Navigator screenOptions={cabecalho}>
      <Stack.Screen name="Lista" component={ListaScreen} options={{ title: 'CuidaPlanta 🌱' }} />
      <Stack.Screen name="Formulario" component={FormularioScreen} options={{ title: 'Nova Planta' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          ...cabecalho,
          tabBarActiveTintColor: cores.verde,
        }}
      >
        <Tab.Screen
          name="MinhasPlantas"
          component={PlantasStack}
          options={{
            title: 'Minhas Plantas',
            headerShown: false, // o Stack de dentro já tem cabeçalho
            tabBarIcon: () => <Text>🌿</Text>,
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapaScreen}
          options={{
            title: 'Mapa',
            tabBarIcon: () => <Text>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="IA"
          component={IAScreen}
          options={{
            title: 'Guia IA',
            tabBarIcon: () => <Text>✨</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
