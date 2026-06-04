# Product Specification Document (PSD)
**Product Name:** VitalSync v2.0
**Document Version:** 1.0

## 1. Architecture Overview
VitalSync is a Single Page Application (SPA) built using React. It relies on a serverless architecture, utilizing Firebase Authentication for identity management and Cloud Firestore for NoSQL document storage.

## 2. Technology Stack
- **Frontend Framework:** React 18 (via Vite)
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (Vanilla CSS + utility classes)
- **Data Visualization:** D3.js
- **Backend & Database:** Firebase (Auth, Firestore)
- **Icons:** React Icons (Feather Icons)
- **Date Formatting:** date-fns

## 3. Data Models (Firestore)

### 3.1 `users` Collection
- Document ID: `uid` (from Firebase Auth)
- Fields: `email` (string), `createdAt` (timestamp)

### 3.2 `health_logs` Collection
- Document ID: Auto-generated
- Fields:
  - `userId` (string)
  - `date` (string format: YYYY-MM-DD)
  - `steps` (number)
  - `heartRate` (number)
  - `sleepHours` (number)
  - `hydrationGlasses` (number)
  - `weight` (number)
  - `notes` (string)
  - `timestamp` (server timestamp)

### 3.3 `goals` Collection
- Document ID: Auto-generated
- Fields:
  - `userId` (string)
  - `targetSteps` (number)
  - `targetHydration` (number)
  - `targetSleep` (number)
  - `targetHeartRate` (number)

### 3.4 `notifications` Collection
- Document ID: Auto-generated
- Fields:
  - `userId` (string)
  - `message` (string)
  - `type` (string: "alert", "success", "info")
  - `read` (boolean)
  - `createdAt` (timestamp)

## 4. UI/UX Specifications
- **Color Palette:** Slate grays for backgrounds/text, vibrant greens (primary), blues (hydration), and purples (sleep) for accents.
- **Dark Mode:** Controlled by the `.dark` class on the `<html>` element. Dark mode utilizes `slate-900` for backgrounds and `slate-800` for cards.
- **Layout:** Max-width constrained containers (`max-w-7xl` and `max-w-6xl`) with centered content. Sticky navigation bars with backdrop blur.
