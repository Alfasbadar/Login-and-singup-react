import { getFirestore, collection, setDoc, arrayUnion, doc } from "firebase/firestore";
import { firestore } from '../config/firebase'; // Assuming you have initialized Firestore in firebase.js

import { getUserEmail } from "./Database";

const distributorCreateBill = async (newBill, distributor) => {
    try {
        const db = getFirestore();
        const userEmail = getUserEmail();

        console.log(userEmail)
        console.log(distributor.id)

        const userDistributionRef = collection(db, 'distribution', userEmail, 'userDistribution').doc(distributor.id);

        // Check if the distributor document exists
        const distributorDocSnap = await userDistributionRef.get();
        if (distributorDocSnap.exists()) {
            // Distributor document exists, proceed to add the bill
            const distributorData = distributorDocSnap.data();

            // Check if bills array exists, if not, create it
            if (!distributorData.bills) {
                distributorData.bills = [];
            }

            // Add the new bill to the bills array
            distributorData.bills.push({
                id: newBill.id,
                date: newBill.date,
                time: newBill.time
            });

            // Update distributor document with the new bill
            await setDoc(userDistributionRef, distributorData);

            console.log('Bill added to Firestore:', newBill);

            return newBill; // Return the created bill data
        } else {
            console.error('Distributor document does not exist.');
            throw new Error('Distributor document does not exist.');
        }
    } catch (error) {
        console.error('Error adding bill to Firestore:', error);
        throw error; // Throw error for handling in the component
    }
};

const retrieveBills = async (distributorId) => {
    try {
        const db = getFirestore();
        const userEmail=  getUserEmail();
        const userDistributionRef = collection(db, 'distribution', userEmail, 'userDistribution').doc(distributorId);

        // Retrieve distributor document
        const distributorDocSnap = await userDistributionRef.get();
        if (distributorDocSnap.exists()) {
            // Distributor document exists, retrieve bills array
            const distributorData = distributorDocSnap.data();
            const bills = distributorData.bills || [];

            return bills; // Return the array of bills
        } else {
            console.error('Distributor document does not exist.');
            throw new Error('Distributor document does not exist.');
        }
    } catch (error) {
        console.error('Error retrieving bills from Firestore:', error);
        throw error; // Throw error for handling in the component
    }
};

export { distributorCreateBill, retrieveBills };
