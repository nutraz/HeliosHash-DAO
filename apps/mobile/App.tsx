import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from './components/Onboarding';
import { PhoneVerification } from './components/PhoneVerification';
import WalletScreen from './components/WalletScreen';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerification} />
  <Stack.Screen name="WalletScreen" component={WalletScreen} initialParams={{ userId: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
