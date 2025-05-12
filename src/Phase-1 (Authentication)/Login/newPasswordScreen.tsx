import React, { useState, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const PasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setError] = useState<{ password?: string; confirmPassword?: string }>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!validatePassword(password)){
      newErrors.password = 'Password must be at least 8 characters long, include one letter, one number, and one special character.';
    }else if (password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required.';
    } else if (!validatePassword(confirmPassword)){
      newErrors.confirmPassword = 'Password must be at least 8 characters long, include one letter, one number, and one special character.';
    }else if (confirmPassword.length < 8) {
      newErrors.confirmPassword = 'Password must be at least 6 characters.';
    }else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password does not match.';
    } else {
      navigation.navigate('Login');
    }

    setError(newErrors);
  };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false, // Hide the header
        });
      }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Password Reset Screen</Text>
      <Text style={styles.subText}>Enter your New Password.</Text> 
      <Text style={styles.label}>New Password</Text>
      <View style={styles.passwordContainer}>
      <TextInput
        style={[styles.passwordInput, { color: 'black' }]}
        secureTextEntry={!passwordVisible}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter new password"
        placeholderTextColor="#aaa"
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
        secureTextEntry={!confirmPasswordVisible}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm new password"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
        <Text style={styles.toggleText}>{confirmPasswordVisible ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      
      <TouchableOpacity style={styles.button} onPress={validateInputs}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(10),
  },
  label: {
    width: wp(80),
    textAlign: 'left',
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: '#ddd',
    borderRadius: hp(1),
    paddingHorizontal: wp(1),
    marginBottom: hp(1.5),
    width: wp(80),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp(1.2),
    fontSize: hp(1.8),
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: wp(80),
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
  headerText: {
    fontSize: hp(3),
    fontWeight: 'bold',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: hp(1.8),
    color: '#888',
    marginBottom: hp(2),
    textAlign: 'center',
  },
    errorText: {
    color: 'red',
    fontSize: hp(1.5),
    marginBottom: hp(1),
  },
  toggleText: {
    color: '#900',
    fontWeight: 'bold',
    padding: hp(1.2),
  },
});

export default PasswordScreen;
