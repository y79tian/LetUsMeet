import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database'; // real time database
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCfREtX1kTvLjQ0TYaJiXU-_dqMnT0Yrwc",
  authDomain: "reventscourse-2690d.firebaseapp.com",
  projectId: "reventscourse-2690d",
  storageBucket: "reventscourse-2690d.appspot.com",
  messagingSenderId: "749315372041",
  appId: "1:749315372041:web:7fbd4e6c8456c67795b4d8",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
