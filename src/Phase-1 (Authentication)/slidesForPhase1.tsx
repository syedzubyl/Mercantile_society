import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

type RootStackParamList = {
  Login: undefined;
};

const Slides = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleDone  = () => {
    navigation.navigate('Login');
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
                source={require('../assets/JSON/page1.json')} // ✅ Renamed for safety
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
                source={require('../assets/JSON/page2.json')} // ✅ Renamed for safety
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
        {
          backgroundColor: '#fff',
          image: (
            <View>
              <LottieView
                source={require('../assets/JSON/page3.json')} // ✅ Renamed for safety
                autoPlay
                loop
                style={styles.lottie3} // ✅ Apply styling
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
    height: hp(30),
    marginRight: wp(18),
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
  lottie3: {
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
    width: wp(80),
    fontSize: hp(4), 
    fontWeight: 'bold', 
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    width: wp(80),
    fontSize: hp(1.8), 
    color: '#666',
    marginLeft: hp(0.1),
    marginBottom: hp(10),
    marginTop: hp(0.5),
    textAlign: 'center',
  },
});

export default Slides;
