# Building Android APK for Finance Tracker

This project is now set up with **Capacitor** to turn your React web app into a native Android application.

## Prerequisites
1.  **Node.js** installed on your computer.
2.  **Android Studio** installed.
3.  **Android SDK** and **Build Tools** installed (via Android Studio).

## Steps to Build APK

### 1. Download the Project
Download the entire project folder to your local computer.

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Build the Web App
Run the build command to generate the `dist` folder:
```bash
npm run build
```

### 4. Sync with Capacitor
Sync the web assets with the Android project:
```bash
npm run cap:sync
```

### 5. Open in Android Studio
Open the `android` folder in Android Studio:
```bash
npm run cap:open:android
```
Alternatively, open Android Studio and select **Open an existing project**, then navigate to the `android` folder in this project.

### 6. Build APK in Android Studio
1.  Wait for Gradle to finish syncing.
2.  Go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3.  Once finished, a notification will appear. Click **locate** to find your `app-debug.apk`.

## Offline Use
The app is designed to work offline. It uses `localStorage` to save your data directly on your device. No internet connection is required to track your finances once the app is installed.

## Sharing the APK
You can share the `app-debug.apk` file with others. They can install it on their Android devices by enabling "Install from Unknown Sources" in their settings.
