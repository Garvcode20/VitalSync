import { db } from '../firebase/config';
import { 
  collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, 
  query, where, orderBy, serverTimestamp, getCountFromServer 
} from 'firebase/firestore';

// HEALTH LOGS
export const addHealthLog = async (userId, data) => {
  return await addDoc(collection(db, 'healthLogs'), {
    ...data,
    userId,
    createdAt: serverTimestamp()
  });
};

export const getHealthLogs = async (userId) => {
  const q = query(collection(db, 'healthLogs'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getHealthLogByDate = async (userId, dateStr) => {
  const q = query(collection(db, 'healthLogs'), where('userId', '==', userId), where('date', '==', dateStr));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const updateHealthLog = async (logId, data) => {
  return await updateDoc(doc(db, 'healthLogs', logId), data);
};

export const deleteHealthLog = async (logId) => {
  return await deleteDoc(doc(db, 'healthLogs', logId));
};

// GOALS
export const addGoal = async (userId, goalData) => {
  return await addDoc(collection(db, 'goals'), {
    ...goalData,
    userId,
    createdAt: serverTimestamp()
  });
};

export const getGoals = async (userId) => {
  const q = query(collection(db, 'goals'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return goals.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

export const updateGoal = async (goalId, data) => {
  return await updateDoc(doc(db, 'goals', goalId), data);
};

export const deleteGoal = async (goalId) => {
  return await deleteDoc(doc(db, 'goals', goalId));
};

// USER PROFILE
export const getUserProfile = async (userId) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
};

export const updateUserProfile = async (userId, data) => {
  return await updateDoc(doc(db, 'users', userId), data);
};

// ADMIN
export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllHealthLogs = async () => {
  const q = query(collection(db, 'healthLogs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTotalLogCount = async () => {
  const snapshot = await getCountFromServer(collection(db, 'healthLogs'));
  return snapshot.data().count;
};

// NOTIFICATIONS
export const addNotification = async (userId, message, type) => {
  return await addDoc(collection(db, 'notifications'), {
    userId,
    message,
    type, // "reminder" | "goal" | "alert"
    read: false,
    createdAt: serverTimestamp()
  });
};

export const markNotificationRead = async (notifId) => {
  return await updateDoc(doc(db, 'notifications', notifId), { read: true });
};

export const markAllNotificationsRead = async (userId) => {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId), where('read', '==', false));
  const snapshot = await getDocs(q);
  const promises = snapshot.docs.map(d => updateDoc(d.ref, { read: true }));
  await Promise.all(promises);
};
