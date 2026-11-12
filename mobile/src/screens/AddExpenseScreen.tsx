import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export function AddExpenseScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>₹</Text>
      </View>

      <Text style={styles.title}>Add expense screen</Text>
      <Text style={styles.description}>
        This second screen confirms that the native navigation stack is working. Amount,
        description, and date fields can be added here next.
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Back to overview</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  icon: {
    color: '#2563eb',
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 24,
  },
  description: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 420,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 14,
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
