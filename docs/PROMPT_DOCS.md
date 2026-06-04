# Prompt Documentation & Guidelines

This document serves as a guideline for interacting with LLM coding assistants (like Claude, ChatGPT, or Antigravity) to maintain, extend, or debug the VitalSync project.

## Core System Prompt Guidelines
When asking an AI to generate new components or modify existing ones, always include the following context to ensure architectural consistency:

### 1. Technology Stack Prompting
> "This is a React 18 application built with Vite and Tailwind CSS. We use Firebase (Auth + Firestore) for the backend. Use modern functional components with React Hooks. Routing is handled by React Router v6."

### 2. Styling & UI Aesthetics Prompting
> "Ensure the UI looks premium, modern, and highly polished. Use Tailwind CSS. Implement smooth hover transitions, glassmorphism where appropriate, and subtle shadows. Do not use generic colors; use Tailwind's slate, emerald, blue, and indigo palettes. Ensure the component supports dark mode by applying appropriate `dark:` prefixed utility classes for backgrounds, text, and borders."

### 3. Data Visualization (D3.js) Prompting
> "When building or modifying charts, use D3.js exclusively. Do not use wrapper libraries like Recharts or Chart.js. Ensure charts are responsive by attaching a `ResizeObserver` or calculating width dynamically using a `useRef` wrapper. Provide distinct visual geometries (e.g., column, line, lollipop, donut) rather than repeating the same bar chart style."

### 4. Firestore Query Prompting
> "When interacting with Firestore, do not use `orderBy` clauses in the query constraints unless a composite index has been explicitly created in the Firebase console. Instead, fetch the documents and sort them client-side in JavaScript to prevent 'index required' errors."

## Example Prompts for Future Features

**Adding a User Profile Page:**
> "Create a new page component called `Profile.jsx`. It should allow the user to view their email (fetched from `AuthContext`) and update their display name. Ensure it matches the aesthetic of the Dashboard, supports Dark Mode via Tailwind `dark:` classes, and handles loading states elegantly."

**Adding a New Metric (e.g., Calories):**
> "We need to add 'Calories Burned' to the health metrics. 
> 1. Update the `LogForm.jsx` to include a number input for Calories.
> 2. Update the `Dashboard.jsx` to show a summary card for Calories.
> 3. Create a new `CaloriesChart.jsx` using D3.js. Make sure it uses a distinct visualization style, like an Area chart, and is fully responsive."
