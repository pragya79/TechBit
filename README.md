# Blogsy

Blogsy is a user-friendly blog application that allows users to create, view, and delete posts. The platform uses Firebase for authentication and data storage, and Cloudinary to handle image uploads. Users can only delete the posts they have created, ensuring privacy and security for all content.

## Features

- **Authentication**: Sign in with Firebase Authentication to securely create and manage posts.
- **Post Creation**: Easily create and publish blog posts with text and images.
- **Image Uploads**: Upload images to posts using Cloudinary for fast, secure storage.
- **Post Deletion**: Users can only delete the posts they have created, ensuring privacy and control over their content.

## Technologies Used

- **Frontend**: React, CSS
- **Backend**: Firebase (Authentication, Firestore Database)
- **Image Handling**: Cloudinary
- **State Management**: React useState & useEffect hooks

## Firebase Configuration

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   
2. **Set Up Firebase Authentication**:
   - In the Firebase Console, navigate to the **Authentication** section.
   - Enable the authentication methods you prefer (e.g., Google Sign-In).

3. **Set Up Firestore Database**:
   - Navigate to the **Firestore Database** section in Firebase Console.
   - Create a Firestore database and set the necessary security rules.

4. **Create Firebase Config File**:
   - In the Firebase Console, go to your project settings and find your Firebase config object.
   - Create a file called `firebase-config.js` in your project and add the config object there.
   - Example:
     ```javascript
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";
     
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);

     export { auth, db };
     ```

## Cloudinary Configuration

1. **Create a Cloudinary Account**:
   - Go to [Cloudinary](https://cloudinary.com/) and create a new account.

2. **Set Up Cloudinary**:
   - After creating your account, navigate to the **Dashboard** to get your API credentials.
   - You'll need the **Cloud Name**, **API Key**, and **API Secret**.

3. **Add Cloudinary Credentials to Your Application**:
   - Install the Cloudinary package if you're using Cloudinary for uploading images.
   - In your application, add the Cloudinary credentials to handle image uploads.
   - Example:
     ```javascript
     import cloudinary from 'cloudinary';

     cloudinary.config({
       cloud_name: 'YOUR_CLOUD_NAME',
       api_key: 'YOUR_API_KEY',
       api_secret: 'YOUR_API_SECRET',
     });
     ```

## Running the Application

To start the application locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pragya79/Blogsy.git
   cd blogsy
2. **Install Dependencies**:
   ```bash
   npm install
3. **Start the application**:
   ```bash
   npm start


## Contact

**Feel free to reach me out and connect with me.**

- **Email**: [pragyaxibs4834@gmail.com](mailto:pragyaxibs4834@gmail.com)
- **LinkedIn**: [Pragya Sharma](https://www.linkedin.com/in/pragya-sharma-4a2136260/)
