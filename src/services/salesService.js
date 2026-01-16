import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    where,
    Timestamp,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'sales';

/**
 * Add a new sale record
 * @param {Object} saleData - Sale data including inputs and calculated values
 * @returns {Promise<string>} Document ID
 */
export async function addSale(saleData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...saleData,
            fecha: Timestamp.fromDate(new Date(saleData.fecha)),
            createdAt: Timestamp.now(),
            syncedAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding sale:', error);
        throw error;
    }
}

/**
 * Get recent sales
 * @param {number} limitCount - Number of records to fetch
 * @returns {Promise<Array>} Array of sale records
 */
export async function getSales(limitCount = 30) {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('fecha', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha.toDate()
        }));
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
}

/**
 * Get the last sale record
 * @returns {Promise<Object|null>} Last sale or null
 */
export async function getLastSale() {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('fecha', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha.toDate()
        };
    } catch (error) {
        console.error('Error fetching last sale:', error);
        throw error;
    }
}

/**
 * Get sales by date range
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {Promise<Array>} Array of sale records
 */
export async function getSalesByDateRange(fromDate, toDate) {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('fecha', '>=', Timestamp.fromDate(fromDate)),
            where('fecha', '<=', Timestamp.fromDate(toDate)),
            orderBy('fecha', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha.toDate()
        }));
    } catch (error) {
        console.error('Error fetching sales by date range:', error);
        throw error;
    }
}

/**
 * Get sales filtered by employee
 * @param {string} empleada - Employee name ('Ingrid' or 'Marta')
 * @param {number} limitCount - Number of records
 * @returns {Promise<Array>} Array of sale records
 */
export async function getSalesByEmployee(empleada, limitCount = 30) {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('empleada', '==', empleada),
            orderBy('fecha', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            fecha: doc.data().fecha.toDate()
        }));
    } catch (error) {
        console.error('Error fetching sales by employee:', error);
        throw error;
    }
}

/**
 * Update a sale record
 * @param {string} id - Document ID
 * @param {Object} data - Updated data
 */
export async function updateSale(id, data) {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            syncedAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
}

/**
 * Delete a sale record
 * @param {string} id - Document ID
 */
export async function deleteSale(id) {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting sale:', error);
        throw error;
    }
}
