# Comprehensive Product Requirements Document (PRD)
**Product Name:** VitalSync v2.0
**Document Version:** 3.0 (Enterprise Specification)
**Date:** June 2026

## 1. Executive Summary & Product Vision
VitalSync is a premium, modern wellness tracking web application designed to help users monitor their daily health metrics, visualize long-term trends, and stay motivated through personalized goals. 
The core philosophy is to replace cluttered spreadsheets and disjointed mobile health apps with a single, visually stunning, and responsive dashboard. It prioritizes data privacy, aesthetic elegance, and actionable insights. This version aims to scale up for potentially thousands of users, with an admin backend for platform management.

## 2. Target Audience & User Personas

### Persona 1: The Data-Driven Optimizer
- **Profile:** 25-40 years old, highly focused on quantified self. Often wears a smartwatch.
- **Needs:** Precise tracking of steps, sleep, hydration, and heart rate. Needs granular charts that can filter across different time scales (7, 14, 30 days).
- **Pain Points:** Existing apps are either too simplistic or lack desktop support. They hate apps that lose data or don't let them edit past entries.
- **Core Feature Use:** The Analytics dashboard, particularly the D3.js visualization charts.

### Persona 2: The Casual Wellness Seeker
- **Profile:** 30-55 years old, trying to build better daily habits (e.g., drinking more water, walking more).
- **Needs:** Simple goal tracking (e.g., "Drink 8 glasses of water"). Easy, frictionless daily data entry.
- **Pain Points:** Overwhelmed by overly complex fitness apps with too many metrics. Requires gentle nudges and positive reinforcement.
- **Core Feature Use:** The Home Dashboard and the Goals page. The simplified summary metric cards are their primary interaction point.

### Persona 3: Platform Administrator (Garv)
- **Profile:** Internal team managing the VitalSync platform, specifically Garv.
- **Needs:** Overview of platform health, user growth, active user metrics, and ability to troubleshoot user accounts.
- **Pain Points:** Lacking visibility into how many users are logging data daily versus dropping off.
- **Core Feature Use:** Admin Dashboard showing global metrics, active user tables, and administrative actions.

## 3. Comprehensive Feature Set

### 3.1 Authentication & Security Framework (Firebase Auth)
- **Registration:** Secure sign-up via Email and Password. 
- **Validation:** Passwords must be strong (minimum 8 characters, alphanumeric). Real-time validation errors displayed beneath the form.
- **Login/Logout:** Session persistence across browser restarts utilizing Firebase's default persistence. Users should not need to log in every time they open the app.
- **Role-Based Access Control (RBAC):** Users are assigned a default "user" role in Firestore upon registration. Admins are assigned the "admin" role manually or by other admins. This unlocks the Admin Dashboard route (`/admin`).
- **Data Isolation:** Firebase Security Rules must rigorously enforce that users can strictly read and write *only* their own Firestore documents based on `request.auth.uid`.

### 3.2 Health Data Logging Engine (CRUD Operations)
- **Daily Metrics Supported:**
  - **Steps:** Integer value (e.g., 10,000). Represents daily total.
  - **Heart Rate:** Integer value in BPM (e.g., 72). Represents resting or average daily heart rate.
  - **Sleep:** Float value in hours (e.g., 7.5). Represents total sleep duration for the previous night.
  - **Hydration:** Integer value in glasses/cups (e.g., 8). Represents total water intake.
  - **Weight:** Float value in kilograms (e.g., 70.5). Represents morning weight.
  - **Notes:** Optional text string for subjective daily feelings (e.g., "Felt very tired today").
- **Validation:** Frontend validation to prevent negative numbers or physically impossible values (e.g., Sleep > 24 hours).
- **Editability Engine:** Users can overwrite today's log if they make a mistake or need to update their values at the end of the day. The system must query if a log exists for today (`getHealthLogByDate`) and seamlessly switch the UI from "Submit" to "Update".

### 3.3 The Dashboard (Command Center)
- **Real-Time Greeting:** A personalized greeting reading "Good morning/evening, [User]!"
- **At-a-glance Summary:** Four distinctive metric cards showing today's logged values compared to their respective goals. The cards feature dynamic color changes (e.g., green when a goal is hit).
- **Quick Actions:** A massive call-to-action button to "Log Today's Data" that conditionally updates to "Update Today's Log ✓" once data is detected for the current date.
- **Mini-Charts:** Lightweight previews of the Analytics charts embedded directly into the dashboard for immediate context without navigating away.

### 3.4 Goal Setting System
- **Customizable Targets:** Users can override default goals (e.g., 8000 steps) with their own personalized targets. 
- **Visual Progress:** Goals are displayed as Circular Progress Rings (Gauge charts) indicating the percentage completion toward the target.
- **Status Lifecycle:** Goals can transition between Active, Completed, or Missed based on user interaction or the expiration of the set deadline. 

### 3.5 Advanced Analytics & Data Visualization (Powered by D3.js)
- **Time Constraints:** Configurable filters for Last 7, 14, or 30 days. The data must re-filter locally to avoid redundant database reads.
- **Distinct Visual Paradigms:**
  - **Steps Chart:** Vertical Column Chart. The bars must feature rounded caps (`rx=4`) for a modern, approachable aesthetic.
  - **Heart Rate Chart:** Continuous Line Chart. It must feature a shaded background rectangle indicating the safe biological zone (60-100 BPM), allowing users to immediately spot outliers.
  - **Sleep Chart:** Lollipop / Scatter Plot configuration. Each day is represented by a vertical stick topped with a circle to clearly delineate discrete nights of sleep.
  - **Hydration Chart:** Donut Chart aggregating the hit/miss ratio of daily goals. Rather than a timeline, this provides an overall success rate percentage in the center of the ring.

### 3.6 Advanced Theme Customization
- **Dark Mode Support:** A system-wide dark mode toggle.
- **Persistence Mechanism:** User theme preference is saved to `localStorage`. The application must read this value immediately upon initialization to prevent a blinding flash-of-light effect for users who prefer dark mode.

### 3.7 Admin Dashboard & Moderation
- **Global Overview:** View total registered users, total health logs, and active goals.
- **User Management Table:** An interactive table listing all users, their emails, roles, and joined dates.
- **Promotion System:** Ability to promote standard users to 'admin' status.
- **Log Inspection:** Ability to expand a user row and preview their most recent health logs for debugging or support purposes.

## 4. Non-Functional Requirements (NFRs)

### Performance Metrics
- **First Input Delay (FID):** Must remain under 100ms. 
- **Largest Contentful Paint (LCP):** Must occur in under 2.5 seconds on standard broadband.
- **Database Reads:** The application must minimize Firestore reads. Data fetched on the dashboard should be cached or passed via context where appropriate to avoid re-fetching the same data on the Analytics page.

### Responsive Design Constraints
- **Mobile-First Approach:** Tailwind implementation ensures usability on screens ranging from 320px (mobile) to 2560px (4K monitors).
- **Navigation:** Desktop features a top-aligned sticky navigation bar. Mobile devices transition to a hamburger menu drawer that slides in from the left to conserve screen real estate.

### Accessibility Standards (a11y)
- **Contrast Ratios:** Ensure minimum contrast ratios of 4.5:1 (especially critical when switching between Light and Dark mode palettes).
- **ARIA Labeling:** Screen readers must be able to parse metric cards, form inputs, and chart data points via ARIA attributes.
- **Keyboard Navigation:** Full tab-based navigability must be maintained across all forms and the navigation menu.

## 5. Future Roadmap (Post v2.0)
- **Wearable Integrations:** Connect with Apple HealthKit and Google Fit APIs to pull steps and heart rate automatically, reducing friction.
- **Social Features:** Allow users to add friends and compete in weekly step challenges.
- **AI Health Insights:** Utilize an LLM to analyze a user's 30-day trends and provide personalized, conversational feedback directly in the app.
