import React, { useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PaymentSuccessScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { paymentId, amount } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/JSON/Payment-Sucess.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.amount}>₹{amount}</Text>
      <Text style={styles.paymentId}>Payment ID: {paymentId}</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
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
    padding: wp(5),
  },
  animation: {
    width: wp(70),
    height: wp(70),
  },
  title: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(2),
  },
  amount: {
    fontSize: hp(4),
    fontWeight: 'bold',
    color: '#900',
    marginTop: hp(2),
  },
  paymentId: {
    fontSize: hp(1.8),
    color: '#666',
    marginTop: hp(1),
  },
  button: {
    backgroundColor: '#900',
    padding: hp(2),
    borderRadius: hp(1),
    alignItems: 'center',
    marginTop: hp(4),
    width: wp(80),
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;