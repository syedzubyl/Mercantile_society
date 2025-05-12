import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Picker } from '@react-native-picker/picker';

enum SignupSteps {
  PHONE_INPUT,
  OTP_VERIFICATION,
  USER_DETAILS,
}

const Signup: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<SignupSteps>(SignupSteps.PHONE_INPUT);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [confirm, setConfirm] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    birthDate: '',
    aadhaarNumber: '',
    state: '',
    address: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeAadhar, setNomineeAadhar] = useState('');
  const [nomineeRelationship, setNomineeRelationship] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateUserDetails = () => {
    const newErrors: any = {};

    if (!age.trim()) {
      newErrors.age = 'Date of Birth is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number.';
    }

    if (!aadhar.trim()) {
      newErrors.aadhar = 'Aadhar number is required.';
    } else if (!/^[0-9]{12}$/.test(aadhar)) {
      newErrors.aadhar = 'Enter a valid 12-digit Aadhar number.';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required.';
    }

    if (!state.trim()) {
      newErrors.state = 'State is required.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the Terms & Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    setPhoneNumber(cleanValue);
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      const formattedPhoneNumber = `+91${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      setConfirm(confirmation);
      setCurrentStep(SignupSteps.OTP_VERIFICATION);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      Alert.alert('Error', err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      await confirm.confirm(otp);
      setCurrentStep(SignupSteps.USER_DETAILS);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
      Alert.alert('Error', err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsSubmit = () => {
    if (validateUserDetails()) {
      console.log('User authenticated with phone. Details:', {
        age,
        phone,
        email,
        address,
        state,
        aadhar,
        nomineeName,
        nomineeAadhar,
        nomineeRelationship,
        password
      });
      Alert.alert('Success', 'Signup completed successfully!');
      const user = auth().currentUser;
      if (user) {
        console.log('Authenticated user ID:', user.uid);
      }
      navigation.navigate('AadharVerification');
    }
  };

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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Phone number verified successfully! Complete your details to continue.</Text>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (DD/MM/YYYY)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

              <Text style={styles.label}>Mobile</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={styles.flexInput}
                  placeholder="Mobile"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={phone || phoneNumber} // Use phoneNumber as default if phone is empty
                  onChangeText={setPhone}
                  editable={false} // Make it non-editable since it's verified
                />
                <View style={[styles.otpButton, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.otpText}>Verified</Text>
                </View>
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

              <Text style={styles.label}>Email ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Email ID"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#aaa"
                value={address}
                onChangeText={setAddress}
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

              <Text style={styles.label}>State</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={state} onValueChange={setState} style={{ color: 'black' }}>
                  <Picker.Item label="Select State" value="" />
                  <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                  <Picker.Item label="Pondicherry" value="Pondicherry" />
                </Picker>
              </View>
              {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

              <Text style={styles.label}>Aadhar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Aadhar Number"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={aadhar}
                onChangeText={setAadhar}
              />
              {errors.aadhar && <Text style={styles.errorText}>{errors.aadhar}</Text>}

              <Text style={styles.sectionTitle}>Nominee Information</Text>
              <Text style={styles.label}>Nominee Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Nominee Name"
                placeholderTextColor="#aaa"
                value={nomineeName}
                onChangeText={setNomineeName}
              />
              {errors.nomineeName && <Text style={styles.errorText}>{errors.nomineeName}</Text>}

              <Text style={styles.label}>Aadhar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Nominee Aadhar Number"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={nomineeAadhar}
                onChangeText={setNomineeAadhar}
              />
              {errors.aadhar && <Text style={styles.errorText}>{errors.aadhar}</Text>}

              <Text style={styles.label}>Nominee Relation</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={nomineeRelationship}
                  onValueChange={setNomineeRelationship}
                  style={{ color: 'black' }}
                >
                  <Picker.Item label="Select Relationship" value="" />
                  <Picker.Item label="Mother" value="Mother" />
                  <Picker.Item label="Father" value="Father" />
                  <Picker.Item label="Sibling" value="Sibling" />
                  <Picker.Item label="Spouse" value="Spouse" />
                  <Picker.Item label="Son" value="Son" />
                  <Picker.Item label="Daughter" value="Daughter" />
                </Picker>
              </View>
              {errors.nomineeRelationship && (
                <Text style={styles.errorText}>{errors.nomineeRelationship}</Text>
              )}

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { color: 'black' }]}
                  placeholder="Set password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Text style={styles.toggleText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { color: 'black' }]}
                  placeholder="Confirm password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  <Text style={styles.toggleText}>
                    {confirmPasswordVisible ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <View style={styles.termsContainer}>
                <BouncyCheckbox
                  size={22}
                  fillColor="#900"
                  unFillColor="#FFF"
                  text="By continuing, you accept the Terms & Conditions"
                  iconStyle={{ borderColor: '#900', borderRadius: 5 }}
                  innerIconStyle={{ borderWidth: 1, borderRadius: 5 }}
                  textStyle={{ fontSize: 12, color: '#555', textDecorationLine: 'none' }}
                  onPress={(isChecked: boolean) => setAcceptTerms(isChecked)}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleUserDetailsSubmit}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                Already a member?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                  Log in
                </Text>
              </Text>
            </View>
          </ScrollView>
        );
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

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  otpInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  flexInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  otpButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  otpText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  toggleText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  termsContainer: {
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
