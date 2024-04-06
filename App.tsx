import React, { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View,PermissionsAndroid } from "react-native";
import auth from '@react-native-firebase/auth';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

import messaging from '@react-native-firebase/messaging';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);


GoogleSignin.configure({
  webClientId: '526009222865-b9ej8s64ljuvqbaron73f40lmm431k25.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}


function App(): React.JSX.Element {

  async function registerAppWithFCM() {
    await messaging().registerDeviceForRemoteMessages();
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    registerAppWithFCM();
  },[])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>App</Text>
      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40 }} placeholder="Enter Email" onChangeText={(text) => {
          setEmail(text);
        }} />

      <Text>--------------------------</Text>
      <TextInput
        style={{ borderColor: 'blue', borderWidth: 1, width: 250, height: 40 }} placeholder="Enter Password" onChangeText={(text) => {
          setPassword(text);
        }} />

      <Button title="Sign In" onPress={() => {
        //sign up
        auth().createUserWithEmailAndPassword(email, password)
          .then(() => {
            console.log('User account created & signed in!');
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
              Alert.alert('That email address is invalid!');
            }
            console.log(error);

          })
      }} />
      <Button
      title="Google Sign-In"
      onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
     />



    </View>
  )
}

export default App;
