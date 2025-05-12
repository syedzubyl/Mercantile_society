// Signup.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Note: You don't need to add the Firebase config here
// The configuration is done through google-services.json (Android)
// and GoogleService-Info.plist (iOS) files

// Enum for form steps
enum SignupSteps {
  PHONE_INPUT,
  OTP_VERIFICATION,
  USER_DETAILS,
  MFA_SETUP
}

const Signup = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<SignupSteps>(SignupSteps.PHONE_INPUT);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaVerificationId, setMfaVerificationId] = useState<string | null>(null);
  const [mfaOtp, setMfaOtp] = useState<string>('');
  
  // User details form state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    // Add more fields as needed
  });

  // Handle phone number input
  const handlePhoneChange = (value: string) => {
    // Allow only numbers
    const cleanValue = value.replace(/\D/g, '');
    setPhoneNumber(cleanValue);
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Format phone number with country code
      const formattedPhoneNumber = `+91${phoneNumber}`;
      
      // Request verification code
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirm(confirmation);
      
      // Move to OTP verification step
      setCurrentStep(SignupSteps.OTP_VERIFICATION);
      
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      Alert.alert('Error', err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }
      
      // Confirm the verification code
      await confirm.confirm(otp);
      
      // Move to user details step
      setCurrentStep(SignupSteps.USER_DETAILS);
      
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
      Alert.alert('Error', err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user details form submission
  const handleUserDetailsSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the currently authenticated user
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Update user profile with additional details
      await user.updateProfile({
        displayName: userDetails.name
      });
      
      // Optional: Update email
      if (userDetails.email) {
        await user.updateEmail(userDetails.email);
      }
      
      // Move to MFA setup step
      setCurrentStep(SignupSteps.MFA_SETUP);
      
    } catch (err: any) {
      console.error('Error updating user details:', err);
      setError(err.message || 'Failed to update user details. Please try again.');
      Alert.alert('Error', err.message || 'Failed to update user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle MFA enrollment
  const handleEnrollMFA = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get the multiFactor object
      const multiFactor = auth().multiFactor(user);
      
      // Start enrollment process
      const session = await multiFactor.getSession();
      
      // Format phone number with country code
      const formattedPhoneNumber = `+91${phoneNumber}`;
      
      // Send verification code to the phone number
      const phoneAuthProvider = auth.PhoneAuthProvider;
      const phoneInfoOptions = {
        phoneNumber: formattedPhoneNumber,
        session: session
      };
      
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        auth().app
      );
      
      setMfaVerificationId(verificationId);
      Alert.alert('Verification code sent', 'Please enter the verification code sent to your phone.');
      
    } catch (err: any) {
      console.error('Error enrolling MFA:', err);
      setError(err.message || 'Failed to set up MFA. Please try again.');
      Alert.alert('Error', err.message || 'Failed to set up MFA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Complete MFA enrollment
  const handleCompleteMFA = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!mfaVerificationId || !mfaOtp) {
        throw new Error('Verification ID or OTP is missing');
      }
      
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Get the multiFactor object
      const multiFactor = auth().multiFactor(user);
      
      // Create credential
      const phoneAuthProvider = auth.PhoneAuthProvider;
      const credential = phoneAuthProvider.credential(mfaVerificationId, mfaOtp);
      
      // Enroll the second factor
      await multiFactor.enroll(credential, 'Phone Number');
      
      Alert.alert('Success', 'Multi-factor authentication has been set up successfully!');
      // Navigate to the next screen or home screen
      
    } catch (err: any) {
      console.error('Error completing MFA enrollment:', err);
      setError(err.message || 'Failed to complete MFA setup. Please try again.');
      Alert.alert('Error', err.message || 'Failed to complete MFA setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render MFA setup step
  const renderMFASetup = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.title}>Set Up Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>Add an extra layer of security to your account</Text>
        
        {!mfaVerificationId ? (
          <TouchableOpacity 
            style={styles.button}
            onPress={handleEnrollMFA}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Setting up...' : 'Set Up 2FA'}</Text>
            {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.otpInput}
              value={mfaOtp}
              onChangeText={(text) => setMfaOtp(text.replace(/\D/g, ''))}
              placeholder="Enter 6-digit verification code"
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
            />
            
            <TouchableOpacity 
              style={[styles.button, (loading || mfaOtp.length !== 6) && styles.disabledButton]}
              onPress={handleCompleteMFA}
              disabled={loading || mfaOtp.length !== 6}
            >
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Complete Setup'}</Text>
              {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
            </TouchableOpacity>
          </>
        )}
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  };

  // Render different steps based on current state
  const renderCurrentStep = () => {
    switch (currentStep) {
      case SignupSteps.PHONE_INPUT:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Enter your phone number to receive a verification code</Text>
            
            <View style={styles.phoneInputGroup}>
              <View style={styles.countryCode}>
                <Text>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                editable={!loading}
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.button, (loading || phoneNumber.length !== 10) && styles.disabledButton]}
              onPress={handleSendOtp}
              disabled={loading || phoneNumber.length !== 10}
            >
              <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
              {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
            </TouchableOpacity>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        );
        
      case SignupSteps.OTP_VERIFICATION:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to +91{phoneNumber}</Text>
            
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
            />
            
            <TouchableOpacity 
              style={[styles.button, (loading || otp.length !== 6) && styles.disabledButton]}
              onPress={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
            >
              <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
              {loading && <ActivityIndicator size="small" color="#fff" style={styles.loader} />}
            </TouchableOpacity>
            
            <View style={styles.resendContainer}>
              <Text>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                <Text style={styles.resendText}>Resend</Text>
              </TouchableOpacity>
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        );
        
      case SignupSteps.USER_DETAILS:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Phone number verified successfully! Complete your details to continue.</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={userDetails.name}
                onChangeText={(text) => setUserDetails({...userDetails, name: text})}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={userDetails.email}
                onChangeText={(text) => setUserDetails({...userDetails, email: text})}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            {/* Add more form fields as needed */}
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleUserDetailsSubmit}
            >
              <Text style={styles.buttonText}>Complete Signup</Text>
            </TouchableOpacity>
          </View>
        );
      case SignupSteps.MFA_SETUP:
        return renderMFASetup();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderCurrentStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center'
  },
  formContainer: {
    width: '100%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  phoneInputGroup: {
    flexDirection: 'row',
    marginBottom: 20
  },
  countryCode: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRightWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    fontSize: 16
  },
  otpInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#4285f4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  disabledButton: {
    backgroundColor: '#cccccc'
  },
  loader: {
    marginLeft: 10
  },
  errorText: {
    color: '#d93025',
    marginTop: 10
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  resendText: {
    color: '#4285f4',
    textDecorationLine: 'underline'
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16
  }
});

export default Signup;
