import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  PaymentMethod: undefined;
};

const Slides = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleDone  = () => {
    navigation.navigate('PaymentMethod');
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
    containerStyles={{paddingHorizontal: 100}}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <View>
              <LottieView
                source={require('../assets/JSON/page4.json')} // ✅ Renamed for safety
                autoPlay
                loop
                style={styles.lottie1} // ✅ Apply styling
              />
            </View>
          ),
          title: (
          <Text style={styles.title}>
            Onboarding
            </Text>
            ),
          subtitle: (
            <Text style={styles.subtitle}> 
              Done with React Native Onboarding Swiper
            </Text>
            ),
        },
        {
          backgroundColor: '#fff',
          image: (
            <View>
              <LottieView
                source={require('../assets/JSON/page5.json')} // ✅ Renamed for safety
                autoPlay
                loop
                style={styles.lottie2} // ✅ Apply styling
              />
            </View>
          ),
          title: (
            <Text style={styles.title}>
              Onboarding
              </Text>
              ),
            subtitle: (
              <Text style={styles.subtitle}> 
                Done with React Native Onboarding Swiper
              </Text>
              ),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(100),
  },
  lottie1: {
    width: wp(123),
    height: hp(35),
    marginRight: wp(5),
    display: 'flex',
    alignItems: 'center',
    marginBottom: hp(10),
    marginTop: hp(12),
  },
  lottie2: {
    width: wp(100),
    height: hp(35),
    marginRight: hp(1),
    display: 'flex',
    justifyContent: 'center',
    marginBottom: hp(10),
    marginTop: hp(12),
    marginLeft: hp(1),
  },
  title: {
    fontSize: hp(4), 
    fontWeight: 'bold', 
    color: '#000',
    width: wp(80),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(1.8), 
    color: '#666',
    marginLeft: hp(0.1),
    marginBottom: hp(10),
    marginTop: hp(0.5),
    width: wp(80),
    textAlign: 'center',
  },
});

export default Slides;
