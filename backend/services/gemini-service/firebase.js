const { initializeApp } = require("firebase/app");



const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    appId: process.env.APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

module.exports = firebaseApp;
