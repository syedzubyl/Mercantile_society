/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const OTPVerification: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const navigateToNextScreen = () => {
    if (otp.join('').length === 6) {
      navigation.goBack();
    }
    if (otp.join('').length < 6) {
      Alert.alert('Please enter the 6-digit OTP code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Almost there</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to your mobile *****2125 for verification.
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={navigateToNextScreen}>
        <Text style={styles.verifyText}>VERIFY</Text>
      </TouchableOpacity>

      <Text style={styles.resendText}>
        <Text style={styles.boldText}>Didn’t receive any code?</Text>
      </Text>
      <TouchableOpacity disabled={isResendDisabled} onPress={() => setIsResendDisabled(true)}>
        <Text style={[styles.timerText, { color: isResendDisabled ? 'gray' : 'red' }]}>
          {isResendDisabled ? `Request new code in 00:${timer}s` : 'Request new code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp(2),
  },
  title: {
    fontSize: hp(3),
    fontWeight: '600',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: hp(2),
    color: 'gray',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  otpInput: {
    width: wp(10.8),
    height: hp(5.5),
    borderWidth: wp(0.2),
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: hp(2.6),
    marginHorizontal: wp(2),
    borderRadius: hp(0.9),
  },
  verifyButton: {
    backgroundColor: '#8B0000',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(10),
    borderRadius: hp(0.9),
    marginBottom: hp(2),
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp(1.7),
  },
  resendText: {
    fontSize: hp(1.8),
    color: 'black',
    marginBottom: hp(0.7),
  },
  boldText: {
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: hp(1.8),
  },
});

export default OTPVerification;
