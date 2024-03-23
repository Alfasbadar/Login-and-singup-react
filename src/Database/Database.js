import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firestore } from '../config/firebase'; // Assuming you have initialized Firestore in firebase.js
import { getFirestore, setDoc, addDoc, doc, collection, deleteDoc } from 'firebase/firestore';

// Function to sign up a new user
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
      if (!user) {
        console.error('User not authenticated');
        return false; // User not authenticated
      }
  
      // Calculate profit and format expiry date
      const profit = parseFloat(productDetails.sellPrice) - parseFloat(productDetails.buyPrice);
      const expiry = productDetails.expiry.replaceAll('/', '-');
  
      // Update productDetails with profit and formatted expiry
      const updatedProductDetails = {
        ...productDetails,
        profit: profit.toFixed(2),
        expiry: expiry
      };
  
      // Add 'products' collection if not present and add product document
      const productsCollectionRef = firestore.collection('products');
      await productsCollectionRef.add(updatedProductDetails);
      console.log('Product added successfully:', updatedProductDetails);
      return true; // Product added successfully
    } catch (error) {
      console.error('Error adding product to Firestore: ', error);
      return false; // Product addition failed
    }
  };
  

// Function to remove a product from Firestore
const removeProductFromDatabase = async (productId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }

    // Remove product from Firestore
    await deleteDoc(doc(collection(firestore, 'products', user.email), productId));
    console.log('Product removed successfully:', productId);
    return true; // Product removed successfully
  } catch (error) {
    console.error('Error removing product from Firestore: ', error);
    return false; // Product removal failed
  }
};

// Function to get all products from Firestore
const getAllProducts = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return []; // Return empty array if user is not authenticated
    }

    // Retrieve all products from Firestore
    const querySnapshot = await firestore.collection('products').doc(user.email).get();
    if (!querySnapshot.exists()) {
      console.error('No products found');
      return []; // Return empty array if no products found
    }

    const productsData = querySnapshot.data();
    const productsArray = Object.values(productsData);
    console.log('All products retrieved:', productsArray);
    return productsArray;
  } catch (error) {
    console.error('Error retrieving products from Firestore: ', error);
    return []; // Return empty array if there's an error
  }
};

// Function to get a product by ID from Firestore
const getProductById = async (productId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return null; // Return null if user is not authenticated
    }

    // Retrieve product by ID from Firestore
    const docSnapshot = await firestore.collection('products').doc(user.email).get(productId);
    if (!docSnapshot.exists()) {
      console.error('Product not found');
      return null; // Return null if product is not found
    }

    const productData = docSnapshot.data();
    console.log('Product retrieved by ID:', productData);
    return productData;
  } catch (error) {
    console.error('Error retrieving product by ID from Firestore: ', error);
    return null; // Return null if there's an error
  }
};

// Function to update a product in Firestore
const updateProductInDatabase = async (productId, updatedProductDetails) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }

    // Update product in Firestore
    await setDoc(doc(collection(firestore, 'products', user.email), productId), updatedProductDetails);
    console.log('Product updated successfully:', updatedProductDetails);
    return true; // Product updated successfully
  } catch (error) {
    console.error('Error updating product in Firestore: ', error);
    return false; // Product update failed
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
  getProductById,
  updateProductInDatabase,
  getUserEmail
};
