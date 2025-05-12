import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [phone, setPhone] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Validation for email or mobile
  const validateEmailOrMobile = (input: string) => {
    // mobile number validation
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(input);
  };

  const handleReset = () => {
    if (!validateEmailOrMobile(phone)) {
      setError('Please enter a valid mobile number.');
      return;
    }

    // Proceed with the reset request logic (API call or navigation)
    setError('');
    // You can navigate to another screen after successful reset request
    navigation.navigate('Otp2');
  };

  useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, // Hide the header
      });
    }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.headerText}>Forgot Password</Text>
        <Text style={styles.subText}>Enter Mobile number to reset your password</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Mobile"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>

        <Text style={styles.backText}>
          Remembered your password?{' '}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Back to Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(10),
  },
  form: {
    width: wp(90),
    maxWidth: wp(90),
    padding: wp(4),
  },
  headerText: {
    fontSize: wp(5.5),
    fontWeight: 'bold',
    marginBottom: wp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: wp(4),
    color: '#888',
    marginBottom: wp(4),
    textAlign: 'center',
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: wp(2),
    padding: wp(2.8),
    marginBottom: wp(3),
    fontSize: wp(3.8),
  },
  button: {
    width: 'auto',
    backgroundColor: '#900',
    padding: wp(3.5),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    width: 'auto',
    alignContent: 'center',
    color: 'white',
    fontSize: wp(3.7),
    fontWeight: 'bold',
  },
  backText: {
    marginTop: wp(3),
    textAlign: 'center',
    fontSize: wp(3.5),
    color: '#555',
  },
  link: {
    color: '#900',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: wp(3.9),
    marginBottom: wp(2),
    textAlign: 'center',
  },
});
