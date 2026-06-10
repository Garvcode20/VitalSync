# Comprehensive API Documentation (Internal Firestore Modules)

This document provides a highly detailed overview of the internal API functions found in `src/api/firestore.js`. Because VitalSync uses Firebase as a Backend-as-a-Service, these JavaScript functions act as a critical abstraction layer. They decouple our React components from the raw Firebase SDK, ensuring that if we ever migrate databases or change SDK versions, our React components remain untouched.

## General Principles & Error Handling
All functions return standard JavaScript Promises. 
- **Success:** The Promise resolves with the requested data or a confirmation of the write operation.
- **Failure:** The Promise rejects. If a Firebase operation fails (e.g., due to a lost internet connection, invalid payload size, or a rejection by Firestore Security Rules), the function will throw an error. 

**Mandatory Best Practice:** Wrapping these calls in `try...catch` blocks within the React components is absolutely mandatory to prevent unhandled promise rejections from crashing the application state. Always implement a loading state (`setLoading(true)`) before calling an API function and unset it in a `finally` block.

---

## 1. Health Logs Operations (`healthLogs` Collection)

### `addHealthLog(userId, logData)`
Creates a new time-series health log. This is the primary data entry point for the application.
- **Parameters:**
  - `userId` (String): The Firebase Authentication UID. Must not be null.
  - `logData` (Object): The payload object.
    - `date` (String): Required. ISO 8601 format (e.g., "2026-06-04").
    - `steps` (Number): Required.
    - `heartRate` (Number): Required.
    - `sleepHours` (Number): Required.
    - `hydrationGlasses` (Number): Required.
    - `weight` (Number): Required.
    - `notes` (String): Optional.
- **Implementation Note:** The function automatically injects `timestamp: serverTimestamp()` into the payload before executing `addDoc()`. This ensures precise chronological tracking based on Google's servers, immune to client-side clock tampering.
- **Returns:** Promise resolving to the `DocumentReference` of the newly created document.

### `getHealthLogs(userId)`
Fetches the entire historical log history for a specific user. This drives the Analytics charts and the History table.
- **Parameters:**
  - `userId` (String): The UID of the user.
- **Implementation Note:** Uses standard `where('userId', '==', userId)`. **Crucially**, it avoids using Firestore `orderBy('date', 'desc')`. Why? Because doing so would trigger a Firebase requirement for a manual composite index, which complicates deployments. Instead, the function fetches all documents and sorts them in-memory using JavaScript `Array.sort()`. Since user datasets rarely exceed 1000 logs in a single query context, the client-side sorting impact is negligible.
- **Returns:** Promise resolving to an array of log objects. Each object includes the Firestore document ID injected as `{ id: doc.id, ...doc.data() }`.

### `getHealthLogByDate(userId, dateStr)`
Looks up a specific log to check if the user has already entered data for that day. This prevents duplicate logs for the same day.
- **Parameters:**
  - `userId` (String): The UID of the user.
  - `dateStr` (String): Date formatted as `YYYY-MM-DD`.
- **Returns:** Promise resolving to a single log object, or `null` if no log exists for that date.

### `updateHealthLog(logId, logData)`
Modifies an existing log. This is executed when a user attempts to log data for a day that already has an existing entry.
- **Parameters:**
  - `logId` (String): The Firestore document ID of the log.
  - `logData` (Object): The fields to update. Missing fields will remain untouched (performs a `setDoc` with `{ merge: true }` or an `updateDoc`).
- **Returns:** Promise resolving to `void`.

### `deleteHealthLog(logId)`
Permanently deletes a specific health log entry.
- **Parameters:**
  - `logId` (String): The Firestore document ID.
- **Returns:** Promise resolving to `void`.

---

## 2. Goals Operations (`goals` Collection)

### `saveGoals(userId, goalsData)`
Upserts the global goals configuration for a specific user.
- **Parameters:**
  - `userId` (String): The UID of the user.
  - `goalsData` (Object): 
    - `targetSteps` (Number)
    - `targetHydration` (Number)
    - `targetSleep` (Number)
    - `targetHeartRate` (Number)
- **Implementation Note:** The function first queries the `goals` collection for documents belonging to `userId`. If one exists, it updates it. If not, it creates a new document. This guarantees a 1-to-1 relationship between users and goal configs, preventing duplicated targets.
- **Returns:** Promise resolving to `void`.

### `getGoals(userId)`
Fetches the active targets for a user.
- **Parameters:**
  - `userId` (String): The UID of the user.
- **Returns:** Promise resolving to an array containing the goals object. The array wrapper is maintained for consistency with other query returns, but consumers should typically access `result[0]`.

---

## 3. Administrative Operations (Admin Restricted)

These operations are strictly for the Admin Dashboard. Executing them as a standard user will result in a hard rejection from Firestore.

### `getAllUsers()`
Fetches the complete user roster for the platform.
- **Parameters:** None.
- **Security Check:** Relies on Firestore Security Rules confirming `request.auth.token.role == 'admin'` or checking the `role` field on the user's document.
- **Returns:** Promise resolving to an array of user objects.

### `getAllHealthLogs()`
Fetches all platform health logs for global analytics.
- **Parameters:** None.
- **Warning:** In a high-scale production environment, reading the entire collection could exceed Firestore quota limits or cause massive memory spikes on the client. For future versions, this should be paginated using `startAfter()` and `limit()`.
- **Returns:** Promise resolving to an array of all logs across all users.
