import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Slides');
      });
    });
  }, []);

  return (
    <LinearGradient 
      colors={['#990000', '#58211A', '#32342A', '#004D3E']} // 4 gradient colors
      style={styles.gradient}
    >
      <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
        <LottieView
          source={require('../assets/JSON/splashScreen.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Mercantile Society</Text>
          <Text style={styles.subtitle}>Makes you list notes</Text>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: wp(130),
    height: hp(50),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
  },
});
