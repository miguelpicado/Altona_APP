import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

/**
 * Sign in with Google
 * @returns {Promise<Object>} User object
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
}

/**
 * Sign out current user
 */
export async function signOut() {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function receiving user object
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAuthChanges(callback) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
    return auth.currentUser;
}
