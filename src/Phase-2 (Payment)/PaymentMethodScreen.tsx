import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PaymentMethodScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const handleMethodSelect = (method: string) => {
    navigation.navigate('PaymentConfirmation', { method });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Payment Methods</Text>
      <Text style={styles.subHeader}>Select Payment Method</Text>

      <TouchableOpacity 
        style={styles.methodCard}
        onPress={() => handleMethodSelect('UPI')}
      >
        <Icon name="cellphone" size={24} color="#007AFF" />
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>UPI</Text>
          <Text style={styles.methodSubtitle}>Pay using UPI apps</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.methodCard}
        onPress={() => handleMethodSelect('PhonePe')}
      >
        <Icon name="phone" size={24} color="#007AFF" />
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>PhonePe</Text>
          <Text style={styles.methodSubtitle}>Pay using PhonePe</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.methodCard}
        onPress={() => handleMethodSelect('NetBanking')}
      >
        <Icon name="bank" size={24} color="#007AFF" />
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Net Banking</Text>
          <Text style={styles.methodSubtitle}>Pay using Net Banking</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: wp(4),
  },
  header: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#000',
  },
  subHeader: {
    fontSize: wp(6),
    fontWeight: 'bold',
    marginBottom: hp(3),
    color: '#000',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
    elevation: 2,
  },
  methodInfo: {
    marginLeft: wp(4),
  },
  methodTitle: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#000',
  },
  methodSubtitle: {
    fontSize: wp(3.5),
    color: '#666',
    marginTop: hp(0.5),
  },
});

export default PaymentMethodScreen;
