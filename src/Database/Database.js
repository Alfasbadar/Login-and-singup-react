import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firestore } from '../config/firebase'; // Assuming you have initialized Firestore in firebase.js
import { getFirestore, setDoc,addDoc,collection,doc } from 'firebase/firestore';

// Function to sign up a new user
const signup = async (email, password,companyName) => {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    const db = getFirestore();
    const usersCollection = collection(db,'users');
    
    const collections = ['Products', 'Distribution', 'Inventory', 'Stores', 'Orders', 'Customers', 'Others','Personals'];
    
    const userDocRef = doc(usersCollection, email);
    await setDoc(userDocRef,{});
    const personalsCollectionRef = collection(userDocRef, 'Personals');
    await setDoc(doc(personalsCollectionRef, 'info'),{
        companyName: companyName,
    });
    console.log("Data stored in database");
    return true; // Signup successful
  } catch (error) {
    console.error('Error creating account:', error.message);
    return false; // Signup failed
  }
};

// Function to log in an existing user
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

// Function to log out the current user
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

// Function to add a new product to Firestore
const addProductToDatabase = async (productDetails) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      console.log(user.email)
      if (!user) {
        console.error('User not authenticated');
        return false; // User not authenticated
      }
  
      // Calculate profit and expiry
      const profit = parseFloat(productDetails.sellPrice) - parseFloat(productDetails.buyPrice);
      const expiry = new Date(); // Add your logic for calculating expiry date
  
      // Update productDetails with profit and expiry
      const updatedProductDetails = {
        ...productDetails,
        profit: profit.toFixed(2),
        expiry: expiry
      };
  
      // Add product to Firestore
      await firestore.collection('users').doc(user.email).collection('products').doc(updatedProductDetails.id).set(updatedProductDetails);
      console.log('Product added successfully:', updatedProductDetails);
      return true; // Product added successfully
    } catch (error) {
      console.error('Error adding product to Firestore: ', error);
      return false; // Product addition failed
    }
  };
  const removeProductFromDatabase = async (productId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return false; // User not authenticated
      }
  
      // Remove product from Firestore
      await firestore.collection('users').doc(user.email).collection('products').doc(productId).delete();
      console.log('Product removed successfully:', productId);
      return true; // Product removed successfully
    } catch (error) {
      console.error('Error removing product from Firestore: ', error);
      return false; // Product removal failed
    }
  };

  const getAllProducts = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return []; // Return empty array if user is not authenticated
      }
  
      // Retrieve all products from Firestore
      const snapshot = await firestore.collection('users').doc(user.email).collection('products').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('All products retrieved:', products);
      return products;
    } catch (error) {
      console.error('Error retrieving products from Firestore: ', error);
      return []; // Return empty array if there's an error
    }
  };
  const getProductById = async (productId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return null; // Return null if user is not authenticated
      }
  
      // Retrieve product by ID from Firestore
      const doc = await firestore.collection('users').doc(user.email).collection('products').doc(productId).get();
      if (!doc.exists) {
        console.error('Product not found');
        return null; // Return null if product is not found
      }
  
      const productData = { id: doc.id, ...doc.data() };
      console.log('Product retrieved by ID:', productData);
      return productData;
    } catch (error) {
      console.error('Error retrieving product by ID from Firestore: ', error);
      return null; // Return null if there's an error
    }
  };
  const getProductByName = async (productName) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return null; // Return null if user is not authenticated
      }
  
      // Query products collection by name
      const querySnapshot = await firestore.collection('users').doc(user.email).collection('products').where('name', '==', productName).get();
      if (querySnapshot.empty) {
        console.error('Product not found');
        return null; // Return null if product is not found
      }
  
      // Assuming there's only one product with the given name, return the first result
      const doc = querySnapshot.docs[0];
      const productData = { id: doc.id, ...doc.data() };
      console.log('Product retrieved by name:', productData);
      return productData;
    } catch (error) {
      console.error('Error retrieving product by name from Firestore: ', error);
      return null; // Return null if there's an error
    }
  };
export { signup, login, logout, addProductToDatabase,removeProductFromDatabase,getAllProducts,getProductById,getProductByName};
