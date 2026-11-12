import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>OVERVIEW</Text>
        <Text style={styles.title}>Track your spending</Text>
        <Text style={styles.subtitle}>
          Your mobile workspace is ready. Add expense features one screen at a time.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total expenses</Text>
        <Text style={styles.amount}>₹0.00</Text>
        <Text style={styles.emptyText}>No expenses have been added yet.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('AddExpense')}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Add an expense</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    padding: 24,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
  },
  cardLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    color: '#0f172a',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
