import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-d8ff8","appId":"1:136101463708:web:bcd0eb5d7bc3653e0e4f59","storageBucket":"ring-of-fire-d8ff8.appspot.com","apiKey":"AIzaSyCpQwOi8HrcmaDXjFlV2lzyFz1hqG0of4g","authDomain":"ring-of-fire-d8ff8.firebaseapp.com","messagingSenderId":"136101463708"})), 
    provideFirestore(() => getFirestore()),
    provideAnimations()
  ]
};
