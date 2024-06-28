  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
  // import { firestore } from '../config/firebase';    (Removed for Production Optimisation)
  import { getFirestore, setDoc,getDoc, doc, collection, deleteDoc, getDocs } from 'firebase/firestore'; // Explicitly import getDocs

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

  // Database code for creating a new bill
  const distributorCreateBill = async (newBill, distributor) => {
    console.log(newBill)
    try {
      console.log("Authenticating user");
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.error('User not authenticated');
        return false; // User not authenticated
      }

      const db = getFirestore();
      const userDistributionRef = doc(collection(db, 'distribution', userEmail, 'userDistribution'), distributor.id);

      const distributorDocSnap = await getDoc(userDistributionRef);
      if (distributorDocSnap.exists()) {
        const distributorData = distributorDocSnap.data();
        if (!distributorData.bills) {
          distributorData.bills = {}; // Initialize bills as an object
        }
        distributorData.bills[newBill.id] = { date: newBill.date, time: newBill.time, products: newBill.products }; // Add bill as a property in the object
        await setDoc(userDistributionRef, distributorData);
        console.log('Bill added to Firestore:', newBill);
        return true; // Bill added successfully
      } else {
        console.error('Distributor document does not exist.');
        return false; // Distributor document does not exist
      }
    } catch (error) {
      console.error('Error adding bill to Firestore:', error);
      return false; // Error adding bill
    }
  };
  const retrieveBills = async (distributorId) => {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.error('User not authenticated');
        return []; // Return empty array if user is not authenticated
      }

      const db = getFirestore();
      const userDistributionRef = doc(collection(db, 'distribution', userEmail, 'userDistribution'), distributorId);
      
      const distributorDocSnap = await getDoc(userDistributionRef);
      if (distributorDocSnap.exists()) {
        const distributorData = distributorDocSnap.data();
        console.log("Distributor data", distributorData.bills);
        
        // Repack the bills into an array with id, date, and time properties
        const bills = Object.entries(distributorData.bills || {}).map(([id, bill]) => ({
          id: id,
          date: bill.date,
          time: bill.time,
          products: bill.products || []
        }));
        
        console.log("retrieved ", bills);
        return bills; // Return the array of bills
      } else {
        console.error('Distributor document does not exist.');
        return []; // Distributor document does not exist
      }
    } catch (error) {
      console.error('Error retrieving bills from Firestore:', error);
      return []; // Error retrieving bills
    }
  };
  const deleteBill = async (distributorId, billId) => {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        console.error('User not authenticated');
        return false; // User not authenticated
      }

      const db = getFirestore();
      const userDistributionRef = doc(collection(db, 'distribution', userEmail, 'userDistribution'), distributorId);

      const distributorDocSnap = await getDoc(userDistributionRef);
      if (distributorDocSnap.exists()) {
        const distributorData = distributorDocSnap.data();
        if (distributorData.bills && distributorData.bills[billId]) {
          delete distributorData.bills[billId]; // Remove the bill from the object
          await setDoc(userDistributionRef, distributorData);
          console.log('Bill deleted from Firestore:', billId);
          return true; // Bill deleted successfully
        } else {
          console.error('Bill does not exist.');
          return false; // Bill does not exist
        }
      } else {
        console.error('Distributor document does not exist.');
        return false; // Distributor document does not exist
      }
    } catch (error) {
      console.error('Error deleting bill from Firestore:', error);
      return false; // Error deleting bill
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
      
      const userEmail = getUserEmail(); // Get user email

      const db = getFirestore();
      
      // Define the document reference for the user distribution
      // const userDistributionRef = doc(collection(db, 'distribution', userEmail, 'userDistribution'), distributorDetails.id);  (Removed for Production Optimisation)
      
      // Define the document reference for the distributor
      const distributorDocumentRef = doc(collection(db, 'distribution', userEmail, 'userDistribution'), distributorDetails.id);
      
      // Set distributorDetails document
      await setDoc(distributorDocumentRef, distributorDetails);
      
      return true;
    } catch (error) {
      console.error('Error adding distribution to Firestore: ', error);
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


  const deleteInventoryFromDatabase = async (inventoryId) => {
    try {
      const user = getUserEmail();
      if (!user) {
        console.error('User not authenticated');
        return false; // User not authenticated, cannot proceed with deletion
      }

      const db = getFirestore();
      const inventoryDocRef = doc(collection(db, 'inventory', user, 'userInventory'), inventoryId);

      // Delete inventory document from Firestore
      await deleteDoc(inventoryDocRef);
      console.log('Inventory deleted successfully:', inventoryId);
      return true; // Inventory deleted successfully
    } catch (error) {
      console.error('Error deleting inventory from Firestore: ', error);
      return false; // Inventory deletion failed
    }
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
    distributorCreateBill,
    retrieveBills,
    deleteBill,
    deleteInventoryFromDatabase
  };