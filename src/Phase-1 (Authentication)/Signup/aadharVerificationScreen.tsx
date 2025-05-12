import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AadharVerification: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const selectFile = async () => {
    Alert.alert("File Selection", "File selection functionality is not available.");
  };

  const handleSubmit = async () => {
    if (!pdfFile) {
      Alert.alert("Error", "Please select an Aadhaar PDF file");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Please enter the password for the Aadhaar PDF");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Details", {
        data: {
          name: "Rahul",
          dob: "15-08-1995",
          aadhaar_number: "1234 5458 9012",
          address: "123, Green Park, New Delhi, India",
        },
      });
    }, 2000); // Simulating a delay like an API call
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Upload Aadhaar PDF</Text>
      <TouchableOpacity style={styles.selectButton} onPress={selectFile}>
        <Text style={styles.selectButtonText}>Select PDF</Text>
      </TouchableOpacity>

      {pdfFile && <Text style={styles.fileName}>Selected: {pdfFile.name}</Text>}

      <Text style={styles.label}>Enter Aadhaar Password</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AadharVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(20),
  },
  button: {
    backgroundColor: '#900',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  toggleText: {
    color: '#900',
    fontWeight: 'bold',
    padding: hp(1.2),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: hp(1.2),
    fontSize: hp(1.8),
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  fileName: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  selectButton: {
    backgroundColor: '#007AFF', // Change this color if needed
    padding: hp(1.6),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(50),
    marginVertical: 10,
  },
  
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});
