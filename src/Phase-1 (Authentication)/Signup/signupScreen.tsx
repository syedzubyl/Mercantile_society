import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DatePicker from 'react-native-date-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons

const Signup: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1)); // Default date: Jan 1, 2000
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nomineeName, setNomineeName] = useState<string>('');
  const [nomineeRelationship, setNomineeRelationship] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [nomineeAadhar, setNomineeAadhar] = useState<string>(''); // Nominee Aadhar state
  const [otp, setOtp] = useState<string>(''); // OTP state
  const [aadhar, setAadhar] = useState<string>(''); // Aadhar state
  const [otpSent, setOtpSent] = useState<boolean>(false); // Track if OTP is sent
  const [errors, setErrors] = useState<{ [key: string] : string }>({});
  const [state, setState] = useState<string>(''); // State of Residence
  const [address, setAddress] = useState<string>(''); // Address state
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  
  // New state for Firebase authentication
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = (password: string) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  // Format date as DD/MM/YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Validation function
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

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

    if (!nomineeAadhar.trim()) {
      newErrors.naadhar = 'Nominee Aadhar number is required.';
    } else if (!/^[0-9]{12}$/.test(nomineeAadhar)) {
      newErrors.naadhar = 'Enter a valid 12-digit Aadhar number.';
    }

    if (!nomineeName.trim()) {
      newErrors.nomineeName = 'Nominee name is required.';
    }

    if (!nomineeRelationship.trim()) {
      newErrors.nomineeRelationship = 'Nominee relationship is required.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(password)){
      newErrors.password = 'Password must be at least 8 characters long, include one letter, one number, and one special character.';
    }else if (password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password does not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      if (!acceptTerms) {
        Alert.alert('Terms & Conditions', 'You must accept the terms to continue.');
        return;
      }
      if (!otpSent) {
        Alert.alert('Error', 'Please verify your mobile number first.');
        return;
      }

      navigation.navigate('AadharVerification');
    }
  };

  const handleOtpClick = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your mobile number first.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      Alert.alert('Error', 'Enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      
      // Format phone number with country code
      const formattedPhoneNumber = `+91${phone}`;
      
      // For Android, we need to use the reCAPTCHA verifier
      let confirmation;
      
      if (Platform.OS === 'android') {
        // On Android, we need to handle reCAPTCHA differently
        // The automatic reCAPTCHA should work, but we'll set a timeout
        // to handle cases where it doesn't appear
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('reCAPTCHA verification timeout')), 30000);
        });
        
        try {
          confirmation = await Promise.race([
            auth().signInWithPhoneNumber(formattedPhoneNumber),
            timeoutPromise
          ]);
        } catch (error) {
          if (error.message === 'reCAPTCHA verification timeout') {
            Alert.alert(
              'Verification Timeout',
              'The reCAPTCHA verification timed out. Please try again or use a different phone number.',
              [{ text: 'OK' }]
            );
            throw error;
          } else {
            throw error;
          }
        }
      } else {
        // For iOS, we can use the standard approach
        confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      }
      
      // Set OTP sent flag
      setOtpSent(true);
      
      // Navigate to OTP Verification screen with phone and confirmation
      navigation.navigate('Otp', { 
        phone: phone,
        confirm: confirmation 
      });
      
      Alert.alert(
        'OTP Sent', 
        `A verification code has been sent to +91 ${phone}. Please check your messages.`
      );
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/invalid-phone-number') {
        Alert.alert('Error', 'The phone number format is incorrect. Please enter a valid number.');
      } else if (error.code === 'auth/quota-exceeded') {
        Alert.alert('Error', 'SMS quota exceeded. Please try again later.');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert(
          'Too Many Attempts', 
          'This phone number has been used too many times recently. Please try again after some time or use a different phone number.'
        );
      } else if (error.code === 'auth/missing-verification-code') {
        Alert.alert('Error', 'Verification code is missing. Please try again.');
      } else if (error.code === 'auth/captcha-check-failed') {
        Alert.alert('Error', 'reCAPTCHA verification failed. Please try again.');
      } else {
        Alert.alert(
          'Error', 
          `Failed to send verification code: ${error.message || 'Unknown error'}\n\nPlease try again later or use a different phone number.`
        );
      }
      
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text style={styles.heading}>Sign Up</Text>
        <Text style={styles.subText}>Create a free account</Text>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name (as per Aadhar)"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity 
          style={styles.datePickerContainer} 
          onPress={() => setDatePickerOpen(true)}
        >
          <View style={styles.datePickerContent}>
            <Text style={[styles.datePickerText, age ? { color: 'black' } : { color: '#aaa' }]}>
              {age || "Select Date of Birth"}
            </Text>
            <View style={styles.calendarIconContainer}>
              <Icon name="calendar-today" size={hp(2.2)} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          open={datePickerOpen}
          date={dob}
          mode="date"
          title="Select Your Date of Birth"
          confirmText="Confirm"
          cancelText="Cancel"
          theme="light"
          maximumDate={new Date()} 
          minimumDate={new Date(1900, 0, 1)}
          onConfirm={(selectedDate) => {
            setDatePickerOpen(false);
            setDob(selectedDate);
            setAge(formatDate(selectedDate));
          }}
          onCancel={() => {
            setDatePickerOpen(false);
          }}
        />
        {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

      <Text style={styles.label}>Mobile</Text>
      <View style={styles.inputWithButton}>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
            <TextInput
              
            style={styles.phoneInput}
            placeholder="Mobile Number"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
            maxLength={10}
          />
        </View>
        <TouchableOpacity 
          style={styles.otpButton} 
          onPress={handleOtpClick}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.otpText}>OTP</Text>
          )}
        </TouchableOpacity>
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
        onChangeText={setAadhar} />
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
        onChangeText={setNomineeAadhar} />
        {errors.aadhar && <Text style={styles.errorText}>{errors.aadhar}</Text>}

        <Text style={styles.label}>Nominee Relation</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={nomineeRelationship} onValueChange={setNomineeRelationship} style={{ color: 'black' }}>
            <Picker.Item label="Select Relationship" value="" />
            <Picker.Item label="Mother" value="Mother" />
            <Picker.Item label="Father" value="Father" />
            <Picker.Item label="Sibling" value="Sibling" />
            <Picker.Item label="Spouse" value="Spouse" />
            <Picker.Item label="Son" value="Son" />
            <Picker.Item label="Daughter" value="Daughter" />
          </Picker>
        </View>
        {errors.nomineeRelationship && (<Text style={styles.errorText}>{errors.nomineeRelationship}</Text>)}

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
      <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
        <Text style={styles.toggleText}>{confirmPasswordVisible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        {/* Replace the checkbox with BouncyCheckbox */}
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already a member?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Log in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  // Keep all the styles as provided in your original code
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(0.8),
    paddingHorizontal: hp(0.5),
    marginBottom: hp(1.7),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp(1.3),
    fontSize: hp(1.7),
  },
  toggleText: {
    color: '#900',
    fontWeight: 'bold',
    padding: hp(1.3),
  },

  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(7),
  },
  form: {
    width: wp(85),
    padding: wp(3),
    backgroundColor: 'white',
  },
  heading: {
    fontSize: hp(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(0.8),
  },
  subText: {
    fontSize: hp(1.8),
    color: '#888',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(0.8),
    padding: hp(1.2),
    marginBottom: hp(1.7),
    fontSize: hp(1.7),
  },
  rowInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexInput: {
    flex: 1,
    marginRight: wp(2),
  },
  otpButton: {
    backgroundColor: '#900',
    paddingHorizontal: hp(2), 
    paddingVertical: wp(2.3),
    borderRadius: hp(0.8),
  },
  otpText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(0.8),
    marginBottom: hp(1.7),
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#444',
    marginBottom: hp(1),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.7),
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    backgroundColor: '#fff',
    borderWidth: wp(0.3),
    borderColor: '#900',
    marginRight: wp(2),
  },
  checkboxChecked: {
    backgroundColor: '#900',
  },
  termsText: {
    fontSize: hp(1.5),
    color: '#555',
  },
  button: {
    backgroundColor: '#900',
    padding: hp(1.3),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2.2),
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: hp(2),
    textAlign: 'center',
    fontSize: hp(2),
    color: '#555',
  },
  link: {
    color: '#900',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: hp(1.6),
    marginBottom: hp(0.7),
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: wp(2),
    marginBottom: wp(3),
  },
  label: {
    width: wp(80),
    textAlign: 'left',
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    paddingLeft: wp(2),
    paddingRight: wp(1),
    fontSize: hp(1.7),
    color: '#333',
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: hp(1.3),
    fontSize: hp(1.7),
  },
  datePickerContainer: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(0.8),
    marginBottom: hp(1.7),
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hp(1.2),
    paddingVertical: hp(1.2),
  },
  datePickerText: {
    fontSize: hp(1.7),
    flex: 1,
  },
  calendarIconContainer: {
    backgroundColor: '#900',
    borderRadius: hp(0.5),
    padding: hp(0.5),
    marginLeft: hp(1),
  },
  calendarIcon: {
    fontSize: hp(1.8),
    color: 'white',
  },
});
