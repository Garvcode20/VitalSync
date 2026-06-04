# Technical Documentation

## 1. Getting Started
### Prerequisites
- Node.js (v18+)
- npm or yarn
- Firebase Project with Firestore and Email/Password Auth enabled.

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and add your Firebase configuration variables:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Run `npm run dev` to start the local development server.

## 2. Directory Structure
```text
src/
├── api/             # Firebase configuration and Firestore wrapper functions
├── components/      # Reusable UI components (Navbar, Footer, MetricCard, LogForm)
│   └── charts/      # D3.js chart components
├── context/         # React Context providers (AuthContext, ThemeContext)
├── pages/           # Route views (Dashboard, Analytics, Goals, Landing, etc.)
├── App.jsx          # Main application component and routing setup
├── index.css        # Global CSS and Tailwind configurations
└── main.jsx         # React DOM entry point
```

## 3. State Management
State is localized where possible. Global state is managed using React Context API:
- `AuthContext`: Manages the current authenticated user session and loading state. Provides `signUp`, `logIn`, and `logOut` methods.
- `ThemeContext`: Manages the global Dark Mode state. Reads from/writes to `localStorage` and toggles the `.dark` class on the document root.

## 4. Styling Approach
The project uses **Tailwind CSS**. 
- Dark mode is implemented using a custom variant in `index.css`: `@custom-variant dark (&:is(.dark *));`.
- UI elements use rounded corners (`rounded-2xl`, `rounded-3xl`), subtle borders (`border-slate-100`), and soft shadows (`shadow-sm`) to achieve a premium look.

## 5. Deployment
The app is configured for deployment on **Vercel**.
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables must be set in the Vercel project settings.
