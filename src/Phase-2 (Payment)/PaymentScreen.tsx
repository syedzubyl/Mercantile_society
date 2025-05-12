import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PaymentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handlePayment = () => {
    if (!amount || !upiId) {
      Alert.alert('Error', 'Please enter amount and UPI ID');
      return;
    }else{
      navigation.navigate('Sucess');
    }

    const amountInPaise = parseInt(amount) * 100; // Convert to paise

    const options = {
      description: 'Payment for services',
      image: 'https://your-company-logo.png',
      currency: 'INR',
      key: 'YOUR_RAZORPAY_KEY', // Replace with your Razorpay key
      amount: amountInPaise,
      name: 'Your Company Name',
      order_id: 'YOUR_ORDER_ID', // Replace with a valid order ID generated from your backend
      prefill: {
        email: 'user@example.com',
        contact: '9999999999',
        method: "upi" as "upi",
        vpa: upiId,
      },
      theme: { color: '#900' }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        // Handle success
        Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
        navigation.navigate('PaymentSuccess', { 
          paymentId: data.razorpay_payment_id,
          amount: amount 
        });
      })
      .catch((error) => {
        // Handle failure
        Alert.alert('Error', `Payment failed: ${error.code} - ${error.description}`);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Make Payment</Text>
        
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>UPI ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter UPI ID (e.g., name@upi)"
          placeholderTextColor="#aaa"
          value={upiId}
          onChangeText={setUpiId}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  form: {
    width: wp(85),
    padding: wp(3),
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(4),
    color: '#000',
  },
  label: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#000',
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(1),
    padding: hp(1.5),
    marginBottom: hp(2.5),
    fontSize: hp(2),
    color: '#000',
  },
  button: {
    backgroundColor: '#900',
    padding: hp(2),
    borderRadius: hp(1),
    alignItems: 'center',
    marginTop: hp(2),
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

export default PaymentScreen;