import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false); // Track if OTP is sent
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validatePassword = (password: string) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);


  // Validation function
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword((password))){
      newErrors.password = 'Password must be at least 8 characters long, include one capital letter, one number, and one special character.';
    }else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit mobile number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateInputs()) {
      navigation.navigate('Slides2'); // Navigate to home or dashboard
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        <Text style={styles.heading}>Login</Text>
        <Text style={styles.subText}>Access your account</Text>
        <Text style={styles.label}>Mobile</Text>
        <View style={styles.inputWithButton}>
          <TextInput
          style={styles.flexInput}
          placeholder="Mobile"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        </View>
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.passwordInput, { color: 'black' }]}
            placeholder="Password"
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

        <View style={styles.rememberForgotContainer}>
          <View style={styles.rememberme}>
            <BouncyCheckbox
              size={22}
              fillColor="#900"
              unFillColor="#FFF"
              text="Remember Me"
              iconStyle={{ borderColor: '#900', borderRadius: 5 }}
              innerIconStyle={{ borderWidth: 1, borderRadius: 5 }}
              textStyle={{ fontSize: 14, color: '#555', textDecorationLine: 'none' }}
              onPress={(isChecked: boolean) => setRememberMe(isChecked)}
            />
          </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  form: {
    width: wp(90),
    padding: hp(2),
    backgroundColor: 'white',
  },
  heading: {
    fontSize: hp(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  subText: {
    fontSize: hp(1.8),
    color: '#888',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(1),
    padding: hp(1.2),
    marginBottom: hp(1.5),
    fontSize: hp(1.8),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(1),
    paddingHorizontal: wp(1),
    marginBottom: hp(1.5),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp(1.2),
    fontSize: hp(1.8),
  },
  toggleText: {
    color: '#900',
    fontWeight: 'bold',
    padding: hp(1.2),
  },
  forgotPassword: {
    color: '#900',
    fontSize: hp(1.7),
    textAlign: 'right',
    marginBottom: hp(0.5),
  },
  button: {
    width: 'auto',
    backgroundColor: '#900',
    padding: hp(1.2),
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: hp(1),
    textAlign: 'center',
    fontSize: hp(1.8),
    color: '#555',
  },
  link: {
    color: '#900',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: hp(1.5),
    marginBottom: hp(1),
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
    marginBottom: hp(1.5),
  },
  rememberme: {
    alignItems: 'center',
    width: wp(40),
  },
  otpButton: {
    backgroundColor: '#900',
    paddingHorizontal: hp(1.6),
    paddingVertical: hp(1.1),
    borderRadius: hp(1),
  },
  otpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp(1.8),
  },
  flexInput: {
    flex: 1,
    marginRight: wp(1),
    padding: hp(1.3),
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(1),
    paddingHorizontal: wp(0.01),
    marginBottom: hp(1.5),
  },
  label: {
    width: wp(80),
    textAlign: 'left',
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});