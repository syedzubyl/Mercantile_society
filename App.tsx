import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/Phase-1 (Authentication)/splashScreen';
import LoginPage from './src/Phase-1 (Authentication)/Login/loginScreen';
import RegistrationPage from './src/Phase-1 (Authentication)/Signup/signupScreen';
import AadharVerification from './src/Phase-1 (Authentication)/Signup/aadharVerificationScreen';
import ForgotPasswordScreen from './src/Phase-1 (Authentication)/Login/forgotPassword';
import ResetConfirmationScreen from './src/Phase-1 (Authentication)/Login/newPasswordScreen';
import OtpScreen from './src/Phase-1 (Authentication)/Signup/otpForSignup';
import Slides from './src/Phase-1 (Authentication)/slidesForPhase1';
import Slides2 from './src/Phase-2 (Payment)/slidesForPhase2';
import OtpScreen2 from './src/Phase-1 (Authentication)/Login/otpForLogin';
import Details from './src/Phase-1 (Authentication)/Signup/demoOcrResult';
import Payment from './src/Phase-2 (Payment)/PaymentScreen';
import PaymentSuccess from './src/Phase-2 (Payment)/PaymentSuccessScreen';
import PaymentMethodScreen from './src/Phase-2 (Payment)/PaymentMethodScreen';
import PaymentConfirmationScreen from './src/Phase-2 (Payment)/PaymentConfirmationScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Slides" component={Slides} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Slides2" component={Slides2} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Otp2" component={OtpScreen2} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="ResetConfirmation" component={ResetConfirmationScreen} />
        <Stack.Screen name="AadharVerification" component={AadharVerification} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Signup" component={RegistrationPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;