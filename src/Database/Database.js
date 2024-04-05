import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firestore } from '../config/firebase'; // Assuming you have initialized Firestore in firebase.js
import { getFirestore, setDoc, addDoc,getDoc,updateDoc, doc, collection, deleteDoc, getDocs } from 'firebase/firestore'; // Explicitly import getDocs

//areyouwatchingclosely
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
    console.log("Authenticating user to add Products")
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }
    const db = getFirestore();
    const userProductsCollectionRef = collection(db, 'products', user, 'userProducts');
    const productDocRef = doc(userProductsCollectionRef, productDetails.id);
    await setDoc(productDocRef, productDetails);
    return true;
  } catch (error) {
    console.error('Error adding product to Firestore: ');
    return false; // Product addition failed
  }
};


const addInventoryToDatabase = async (inventoryDetails) => {
  try {
    const user = getUserEmail();
    console.log("Authenticating user to add Inventory")
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }
    const db = getFirestore();
    const userProductsCollectionRef = collection(db, 'inventory', user, 'userInventory');
    const productDocRef = doc(userProductsCollectionRef, inventoryDetails.id);
    await setDoc(productDocRef, inventoryDetails);
    return true;
  } catch (error) {
    console.error('Error adding inventory to Firestore: ');
    return false; // Product addition failed
  }
};


const addDistributorToDatabase = async (distributorDetails) => {
  try {
    const user = getUserEmail();
    console.log("Authenticating user to add Inventory")
    if (!user) {
      console.error('User not authenticated');
      return false; // User not authenticated
    }
    const db = getFirestore();
    const userCollectionRef = collection(db, 'distribution', user, 'userDistribution');
    const distributorDocumentRef = doc(userCollectionRef, distributorDetails.id);
    await setDoc(distributorDocumentRef, distributorDetails);
    return true;
  } catch (error) {
    console.error('Error adding distribution to Firestore: ');
    return false;
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
  const productDocRef = doc(collection(db, 'products', user, 'userProducts'), productId);

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
    console.log(querySnapshot)
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

const getAllDistributor = async () => {
  try {
    const user = getUserEmail();
    if (!user) {
      console.error('User not authenticated');
      return []; // Return empty array if user is not authenticated
    }
    
    const db = getFirestore();
    const useDistributorRef = collection(db, 'distribution', user, 'userDistribution');
    const querySnapshot = await getDocs(useDistributorRef);
    console.log(querySnapshot)
    const distributionArray = [];
    querySnapshot.forEach((doc) => {
      distributionArray.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('All distributions retrieved:', distributionArray);
    return distributionArray;
  } catch (error) {
    console.error('Error retrieving inventory from Firestore: ', error);
    return []; // Return empty array if there's an error
  }
};

const getAllInventory = async () => {
  try {
    const user = getUserEmail();
    if (!user) {
      console.error('User not authenticated');
      return []; // Return empty array if user is not authenticated
    }
    
    const db = getFirestore();
    const userInventoryCollectionRef = collection(db, 'inventory', user, 'userInventory');
    const querySnapshot = await getDocs(userInventoryCollectionRef);
    console.log(querySnapshot)
    const inventoryArray = [];
    querySnapshot.forEach((doc) => {
      inventoryArray.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('All inventory retrieved:', inventoryArray);
    return inventoryArray;
  } catch (error) {
    console.error('Error retrieving inventory from Firestore: ', error);
    return []; // Return empty array if there's an error
  }
};
const editProducts = (product) => {
console.log("Showing Product in edit Product" ,product.id)
if(removeProductFromDatabase(product.id)){
  console.log(">Removed")
  if(addProductToDatabase(product)){
    console.log("Product updated")
  }else{
    console.log("Failed to edit Product")
  }
}
else{
  console.log("Failed to remove")
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
  editProducts,
  getUserEmail,
  addInventoryToDatabase,
  getAllInventory,
  addDistributorToDatabase,
  getAllDistributor,
};