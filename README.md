# 🚀 Welcome to TechBit – A Creative Space for Code & Content!

TechBit is an interactive, user-friendly tech-blog application that empowers developers and tech enthusiasts to **create, share, and manage** their own blogs with ease. It’s not just a blogging tool — it’s a stage to showcase your technical voice and project documentation.

Built with ❤️ using Firebase for backend services and Cloudinary for seamless image handling, **TechBit** makes sure your ideas take center stage while ensuring **privacy, performance, and style**.

![TechBit Demo](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHNqZWw1cTNrM3I2Ymd5aXU5aTJ3OWZ2aDhsdGVsZXg2ZXllN3pzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/JtBZmzjyx4eBfSHTBQ/giphy.gif)

---

## ✨ Features

- 🔐 **Authentication**: Sign in securely with Firebase Authentication to create and manage your posts.
- 📝 **Post Creation**: Write and publish blog posts with rich text using **React Quill** editor.
- 🖼️ **Image Uploads**: Upload and embed images using Cloudinary for smooth, fast storage.
- 🗑️ **Post Deletion**: Users can only delete the posts they have created, ensuring content privacy and control.

---

## 🛠️ Technologies Used

- **Frontend**: React, CSS
- **Rich Text Editor**: React Quill
- **Backend**: Firebase (Authentication, Firestore Database)
- **Image Handling**: Cloudinary
- **State Management**: React `useState` & `useEffect` hooks

---

## 🔧 Firebase Configuration

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Set Up Firebase Authentication**:
   - In the Firebase Console, navigate to the **Authentication** section.
   - Enable your preferred sign-in methods (e.g., Google Sign-In).

3. **Set Up Firestore Database**:
   - Go to the **Firestore Database** section.
   - Create your database and apply the necessary security rules.

4. **Create Firebase Config File**:
   - Go to project settings in Firebase Console to find your config object.
   - Create a `firebase-config.js` file in your project and paste the config object.

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
