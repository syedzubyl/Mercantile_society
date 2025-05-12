import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import RazorpayCheckout from 'react-native-razorpay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PaymentConfirmationScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { method } = route.params;

  const handlePayment = () => {
    if (!isAgreed) {
      Alert.alert('Error', 'Please agree to pay the platform fees');
      return;
    }

    const options = {
      description: 'Platform Fee Payment',
     // image: 'https://your-company-logo.png',
      currency: 'INR',
      key: 'rzp_test_ZOALeH3o37D2Hh', // Replace with your test key
      amount: 100, // Amount in paise (100 INR)
      name: 'Your Company Name',
      order_id: 'order_' + Date.now(), // Generate order ID
      prefill: {
        email: 'user@example.com',
        contact: '9999999999',
        method: method.toLowerCase(),
      },
      theme: { color: '#007AFF' }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        navigation.navigate('PaymentSuccess', {
          paymentId: data.razorpay_payment_id,
          amount: '100'
        });
      })
      .catch((error) => {
        Alert.alert('Error', `Payment failed: ${error.description}`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Details</Text>

      <View style={styles.card}>
        <Text style={styles.feeTitle}>Platform Fee</Text>
        <Text style={styles.amount}>₹100.00</Text>
        <Text style={styles.description}>
          This fee helps us maintain and improve our platform services
        </Text>
      </View>

      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
          size={24}
          fillColor="#007AFF"
          unFillColor="#FFFFFF"
          text="I agree to pay ₹100 as platform fees"
          iconStyle={{ borderColor: "#007AFF" }}
          textStyle={{ textDecorationLine: "none" }}
          onPress={(isChecked: boolean) => setIsAgreed(isChecked)}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, !isAgreed && styles.buttonDisabled]}
        onPress={handlePayment}
        disabled={!isAgreed}
      >
        <Text style={styles.buttonText}>Continue to Payment</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: hp(3),
    color: '#000',
  },
  card: {
    backgroundColor: 'white',
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(3),
  },
  feeTitle: {
    fontSize: wp(4),
    color: '#000',
  },
  amount: {
    fontSize: wp(7),
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: hp(1),
  },
  description: {
    fontSize: wp(3.5),
    color: '#666',
  },
  checkboxContainer: {
    marginBottom: hp(3),
  },
  button: {
    backgroundColor: '#007AFF',
    padding: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default PaymentConfirmationScreen;
