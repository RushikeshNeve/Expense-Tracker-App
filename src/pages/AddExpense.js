import React, { useState, useEffect } from "react";
import { db, auth } from "../database";
import { addDoc, collection, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const AddExpenseDrawer = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState(""); // New source field
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().categoryName,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category || !source) return;

    try {
      await addDoc(collection(db, "expenses"), {
        amount: parseFloat(amount),
        category,
        description,
        source, // Include source
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
      });
      setAmount("");
      setCategory("");
      setDescription("");
      setSource(""); // Reset source field
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className={`offcanvas offcanvas-end ${isOpen ? "show" : ""}`} tabIndex="-1">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title">Add Expense</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleAddExpense}>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Source</label>
            <input type="text" className="form-control" placeholder="E.g. Salary, Savings, Gift" value={source} onChange={(e) => setSource(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input type="text" className="form-control" placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseDrawer;
