import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { HomeScreen } from '../screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        contentStyle: { backgroundColor: '#f8fafc' },
        headerShadowVisible: false,
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Expense Tracker' }} />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Add expense' }}
      />
    </Stack.Navigator>
  );
}
