import 'dotenv/config';

export default {
  expo: {
    name: 'Clink Parking',
    slug: 'clink-developer',
    privacy: 'public',
    platforms: ['android'],
    version: '0.15.0',
    orientation: 'portrait',
    icon: './assets/clinker.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#F57C00'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },    
      android: {
        package: "com.clink.android",
        config: {
          googleMaps: {
            apiKey: "AIzaSyDLHnCAz-jf_0NGstRZ9pM0rXXumg6c4_w"
          }
      }
    }
    ,
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "4edc0106-0738-42ff-a0b0-16e90f90bccc"
      }
    }
  }
};
