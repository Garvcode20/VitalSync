# API Documentation (Internal Firestore API)

This document outlines the internal API wrapper functions located in `src/api/firestore.js`. These functions abstract the Firebase SDK calls.

## Health Logs

### `addHealthLog(userId, logData)`
Creates a new health log entry for the user.
- **Parameters:**
  - `userId` (String): The UID of the authenticated user.
  - `logData` (Object): Must contain `date`, `steps`, `heartRate`, `sleepHours`, `hydrationGlasses`, `weight`, and `notes`.
- **Returns:** Promise resolving to the newly created document reference.

### `getHealthLogs(userId)`
Fetches all health logs for a specific user, sorted client-side by date.
- **Parameters:**
  - `userId` (String): The UID of the user.
- **Returns:** Promise resolving to an array of log objects.

### `getHealthLogByDate(userId, dateStr)`
Fetches a single health log for a specific date.
- **Parameters:**
  - `userId` (String): The UID of the user.
  - `dateStr` (String): Date formatted as `YYYY-MM-DD`.
- **Returns:** Promise resolving to the log object, or `null` if not found.

### `updateHealthLog(logId, logData)`
Updates an existing health log.
- **Parameters:**
  - `logId` (String): The Firestore document ID of the log.
  - `logData` (Object): The updated fields.
- **Returns:** Promise resolving when the update is complete.

### `deleteHealthLog(logId)`
Deletes a specific health log.
- **Parameters:**
  - `logId` (String): The Firestore document ID of the log.
- **Returns:** Promise resolving when the deletion is complete.

## Goals

### `getGoals(userId)`
Fetches the goals document for a specific user.
- **Parameters:**
  - `userId` (String): The UID of the user.
- **Returns:** Promise resolving to an array containing the goals object (usually only 1 document per user).

### `saveGoals(userId, goalsData)`
Creates or updates the user's goals.
- **Parameters:**
  - `userId` (String): The UID of the user.
  - `goalsData` (Object): Must contain `targetSteps`, `targetHydration`, `targetSleep`, and `targetHeartRate`.
- **Returns:** Promise resolving when the save is complete.

## Notifications

### `addNotification(userId, message, type)`
Creates a new notification for the user.
- **Parameters:**
  - `userId` (String): The UID of the user.
  - `message` (String): The notification text.
  - `type` (String): Enum value ("alert", "success", "info").
- **Returns:** Promise resolving to the created document reference.
