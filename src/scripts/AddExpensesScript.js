import { db, auth } from "../database";
import { addDoc, collection, getDocs } from "firebase/firestore";

// Categories & Sources
const sources = ["Savings", "Credit Card", "Debit Card", "Cash", "UPI"];
const getRandomDate = () => {
  const start = new Date("2024-01-01").getTime();
  const end = new Date("2025-02-28").getTime();
  return new Date(start + Math.random() * (end - start));
};
// Function to generate random expenses
const generateRandomExpense = async () => {
  console.log("Generating random expense...");
  const querySnapshot = await getDocs(collection(db, "categories"));
  const categoryList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().categoryName,
   }));
   const categories = categoryList.map((category) => category.name);
   console.log("Categories:", categories);
  return {
    amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)), // Random amount (₹100 - ₹5100)
    category: categories[Math.floor(Math.random() * categories.length)], // Random category
    description: "Dummy transaction", // Dummy description
    source: sources[Math.floor(Math.random() * sources.length)], // Random source
    userId: auth.currentUser?.uid,
    createdAt: getRandomDate(),
  };
};

// Function to add multiple dummy expenses
const AddDummyExpenses = async () => {
  try {
    const numRecords = 30; // Number of dummy expenses to add
    console.log(`Adding ${numRecords} dummy expense records...`);
    for (let i = 0; i < numRecords; i++) {
      const newExpense = await generateRandomExpense();
      console.log("Adding Expense #", i + 1, ":", newExpense);
      await addDoc(collection(db, "expenses"), newExpense)
      console.log(`Added Expense #${i + 1}:`, newExpense);
    }
    console.log(`Here------`);
    console.log(`util${numRecords} dummy expense records added successfully.`);
  } catch (error) {
    console.error("Error adding dummy expenses:", error);
  }
};

export default AddDummyExpenses;
