import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firestore } from '../config/firebase'; // Assuming you have initialized Firestore in firebase.js
import { getFirestore, setDoc, addDoc,getDoc, doc, collection, deleteDoc, getDocs } from 'firebase/firestore'; // Explicitly import getDocs

const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    return true; // Logout successful
  } catch (error) {
    console.error('Error logging out:', error.message);
    return false; // Logout failed
  }
};

const login = async (email, password) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    return true; // Login successful
  } catch (error) {
    console.error('Error logging in:', error.message);
    return false; // Login failed
  }
};


const signup = async (email, password, companyName) => {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    const db = getFirestore();
    const usersCollection = collection(db, 'users');

    const userDocRef = doc(usersCollection, email);
    await setDoc(userDocRef, {});

    const personalsCollectionRef = collection(userDocRef, 'Personals');
    await setDoc(doc(personalsCollectionRef, 'info'), {
      companyName: companyName,
    });

    console.log("Data stored in database");
    return true; // Signup successful
  } catch (error) {
    console.error('Error creating account:', error.message);
    return false; // Signup failed
  }
};
const addProductToDatabase = async (productDetails) => {
  try {
    const user = getUserEmail();
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }

    // Calculate profit and format expiry date
    const profit = parseFloat(productDetails.sp) - parseFloat(productDetails.bp);
    const expiry = productDetails.expiry.replaceAll('/', '-');

    // Update productDetails with profit and formatted expiry
    const updatedProductDetails = {
      ...productDetails,
      profit: profit.toFixed(2),
      expiry: expiry
    };

    const db = getFirestore();
    const userProductsCollectionRef = collection(db, 'users', user, 'userProducts');

    // Add the product details to the subcollection
    await addDoc(userProductsCollectionRef, updatedProductDetails);

    console.log('Product added successfully');
    return true; // Product added successfully
  } catch (error) {
    console.error('Error adding product to Firestore: ', error);
    return false; // Product addition failed
  }
};


// Function to remove a product from Firestore
const removeProductFromDatabase = async (productId) => {
try {
  const user = getUserEmail();
  if (!user) {
    console.error('User not authenticated');
    return false; // User not authenticated
  }

  const db = getFirestore();
  const productDocRef = doc(collection(db, 'users', user, 'userProducts'), productId);

  // Remove product from Firestore
  await deleteDoc(productDocRef);
  console.log('Product removed successfully:', productId);
  return true; // Product removed successfully
} catch (error) {
  console.error('Error removing product from Firestore: ', error);
  return false; // Product removal failed
}
};

const getAllProducts = async () => {
  try {
    const user = getUserEmail();
    if (!user) {
      console.error('User not authenticated');
      return []; // Return empty array if user is not authenticated
    }

    const db = getFirestore();
    const userProductsCollectionRef = collection(db, 'products', user, 'userProducts');
    const querySnapshot = await getDocs(userProductsCollectionRef);

    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push({ id: doc.id, ...doc.data() });
    });

    console.log('All products retrieved:', productsArray);
    return productsArray;
  } catch (error) {
    console.error('Error retrieving products from Firestore: ', error);
    return []; // Return empty array if there's an error
  }
};

const getUserEmail = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  return user ? user.email : null;
};


export {
  signup,
  login,
  logout,
  addProductToDatabase,
  removeProductFromDatabase,
  getAllProducts,
  getUserEmail
};
