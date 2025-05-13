/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';

const OtpForSignup: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { phone, confirm } = route.params;
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check if confirm object exists
      if (!confirm) {
        setError('Verification session expired. Please request a new OTP.');
        Alert.alert('Error', 'Verification session expired. Please request a new OTP.');
        return;
      }
      
      // Confirm the verification code
      await confirm.confirm(otpString);
      
      Alert.alert('Success', 'Mobile number verified successfully!');
      navigation.goBack();
      
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code. Please check and try again.');
        Alert.alert('Error', 'Invalid verification code. Please check and try again.');
      } else if (err.code === 'auth/session-expired') {
        setError('Verification session has expired. Please request a new OTP.');
        Alert.alert('Error', 'Verification session has expired. Please request a new OTP.');
      } else {
        setError(err.message || 'Invalid OTP. Please try again.');
        Alert.alert('Error', err.message || 'Invalid OTP. Please try again.');
      }
      
      // Clear OTP fields on error for better UX
      setOtp(new Array(6).fill(''));
      // Focus on first input field
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format phone number with country code
      const formattedPhoneNumber = `+91${phone}`;
      
      // Request a new verification code
      let newConfirmation;
      try {
        newConfirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
        route.params.confirm = newConfirmation;
        
        // Reset timer
        setTimer(30);
        setIsResendDisabled(true);
        
        Alert.alert(
          'OTP Resent', 
          `A new verification code has been sent to +91 ${phone}. Please check your messages.`
        );
      } catch (verificationError) {
        console.error('Verification error:', verificationError);
        if (verificationError.code === 'auth/captcha-check-failed') {
          Alert.alert(
            'Verification Failed',
            'The reCAPTCHA verification failed. Please try again.'
          );
        } else {
          throw verificationError;
        }
      }
      
    } catch (err) {
      console.error('Error resending OTP:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again after some time or use a different phone number.');
        Alert.alert(
          'Too Many Attempts', 
          'This phone number has been used too many times recently. Please try again after some time or use a different phone number.'
        );
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
        Alert.alert('Error', 'SMS quota exceeded. Please try again later.');
      } else {
        setError(err.message || 'Failed to resend OTP. Please try again.');
        Alert.alert(
          'Error', 
          `Failed to resend OTP: ${err.message || 'Unknown error'}\n\nPlease try again later or use a different phone number.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Format phone for display (hide all but last 4 digits)
  const formatPhoneForDisplay = () => {
    if (phone.length <= 4) return phone;
    return '+91 *****' + phone.slice(-4);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Almost there</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to your mobile {formatPhoneForDisplay()} for verification.
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
            editable={!loading}
          />
        ))}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.verifyButton, loading && styles.disabledButton]} 
        onPress={handleVerifyOtp}
        disabled={loading || otp.join('').length !== 6}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.verifyText}>VERIFY</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.resendText}>
        <Text style={styles.boldText}>Didn't receive any code?</Text>
      </Text>
      <TouchableOpacity 
        disabled={isResendDisabled || loading} 
        onPress={handleResendOtp}
      >
        <Text style={[styles.timerText, { color: isResendDisabled || loading ? 'gray' : '#8B0000' }]}>
          {isResendDisabled ? `Request new code in 00:${timer < 10 ? '0' + timer : timer}s` : 'Request new code'}
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
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: wp(40),
    height: hp(6),
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  errorText: {
    color: '#d93025',
    marginBottom: hp(1.5),
    fontSize: hp(1.6),
    textAlign: 'center',
  },
});

export default OtpForSignup;
