# Product Requirements Document (PRD)
**Product Name:** VitalSync v2.0
**Document Version:** 1.0
**Date:** June 2026

## 1. Product Vision & Scope
VitalSync is a premium, modern wellness tracking application designed to help users monitor their daily health metrics, visualize long-term trends, and stay motivated through personalized goals. The goal is to replace cluttered spreadsheets and disjointed health apps with a single, visually stunning, and responsive dashboard.

## 2. Target Audience
- Health-conscious individuals looking for a consolidated view of their wellness.
- Fitness enthusiasts who want to track specific metrics like steps and heart rate.
- Data-driven users who appreciate detailed, beautiful analytics.

## 3. Key Features
### 3.1 Authentication & User Management
- Secure sign-up and login via email/password.
- Protected routes to ensure data privacy.

### 3.2 Daily Health Logging
- Ability to log Steps, Heart Rate (BPM), Sleep (Hours), Hydration (Glasses), and Weight (kg).
- Ability to update or edit logs for the current day.

### 3.3 Dashboard
- Real-time summary of today's logged metrics.
- Visual progress bars comparing today's data against user-defined goals.
- Notifications and alerts for low activity.

### 3.4 Goal Setting
- Set target thresholds for Steps, Hydration, Sleep, and Heart Rate.
- Goals persist and automatically calculate progress on the Dashboard.

### 3.5 Analytics & Data Visualization
- **Steps:** Vertical Column Chart with rounded tops.
- **Heart Rate:** Line Chart highlighting normal healthy ranges.
- **Sleep:** Lollipop/Scatter Plot.
- **Hydration:** Donut Chart summarizing goal hit/miss ratio.
- Configurable time filters (7 Days, 14 Days, 30 Days).

### 3.6 System-Wide Dark Mode
- Seamless toggle between light and dark themes.
- Persistent user preference across sessions.

## 4. Non-Functional Requirements
- **Performance:** App must load in under 2 seconds. State updates must feel instantaneous.
- **Responsiveness:** Must be fully usable on mobile, tablet, and desktop devices.
- **Aesthetics:** High-end UI with glassmorphism, smooth animations, and tailored color palettes.
- **Security:** Firebase Security Rules must enforce that users can only read/write their own data.
