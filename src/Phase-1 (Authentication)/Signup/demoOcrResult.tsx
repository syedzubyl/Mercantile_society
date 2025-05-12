import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const AadharDetails: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
  const { data } = route.params;

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, 
      });
    }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aadhaar Details</Text>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{data.name || "N/A"}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>DOB:</Text>
        <Text style={styles.value}>{data.dob || "N/A"}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Aadhaar Number:</Text>
        <Text style={styles.value}>{data.aadhaar_number || "N/A"}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{data.address || "N/A"}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
    </ScrollView>
  );
};

export default AadharDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(15),
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailBox: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
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
});



