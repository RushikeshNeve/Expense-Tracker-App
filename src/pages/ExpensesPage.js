import React, { useEffect, useState } from "react";
import { db, auth } from "../database";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, where } from "firebase/firestore";
import { FiEdit, FiTrash2, FiPlus, FiDownload, FiFilter } from "react-icons/fi";
import { Button, IconButton, Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Divider } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Modal from "./Modal";
import AddExpenseDrawer from "./AddExpense";
import ExportToExcel from "./ExportToExcel";
import FilterDrawer from "./FilterDrawer";
import TabComponent from "../components/Tabs";
import ConfirmationModal from "../components/ConfirmationModal";

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState({ category: "ALL", minAmount: "", maxAmount: "", date: "", month: "" });
  const [editExpense, setEditExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const fetchExpenses = async () => {
    const user = auth.currentUser;
    const q = query(collection(db, "expenses"), where("userId", "==", user.uid),orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const expenseList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setExpenses(expenseList);
    setFilteredExpenses(expenseList);
  };
  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleUpdateExpense = async (updatedExpense) => {
    await updateDoc(doc(db, "expenses", updatedExpense.id), updatedExpense);
    setShowModal(false)
    setExpenses((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
    setFilteredExpenses((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)));
  };

  const applyFilters = (newFilters) => {
    let filtered = expenses;
    if (newFilters.category !== "ALL") filtered = filtered.filter((e) => e.category === newFilters.category);
    if (newFilters.minAmount) filtered = filtered.filter((e) => e.amount >= parseFloat(newFilters.minAmount));
    if (newFilters.maxAmount) filtered = filtered.filter((e) => e.amount <= parseFloat(newFilters.maxAmount));
    if (newFilters.date) {
      filtered = filtered.filter((e) => {
        const expenseDate = new Date(e.createdAt.seconds * 1000).toISOString().split("T")[0];
        return expenseDate === newFilters.date;
      });
    }
    if (newFilters.month) {
      filtered = filtered.filter((e) => {
        const expenseDate = new Date(e.createdAt.seconds * 1000);
        const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
        return expenseMonth === newFilters.month;
      });
    }
    setFilteredExpenses(filtered);
  };

  const resetFilters = () => {
    setFilter({ category: "ALL", minAmount: "", maxAmount: "", date: "", month: "" });
    setFilteredExpenses(expenses);
  };

  const handleDeleteExpense = async () => {
    if (expenseToDelete) {
      await deleteDoc(doc(db, "expenses", expenseToDelete.id));
      setShowConfirmModal(false);
      setExpenseToDelete(null);
      fetchExpenses(); // Refresh data after deletion
    }
  };

  const handleAddExpenseDrawerClose = async () => {
    setShowDrawer(false)
    fetchExpenses()
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Navbar with Border Covering Everything */}
      <Paper sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2, boxShadow: 3 }}>
        <TabComponent activeTab="expenses" />
        {/* Buttons Aligned to Right */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton onClick={() => setShowDrawer(true)} color="primary">
            <FiPlus />
          </IconButton>
          <IconButton onClick={() => setShowExportModal(true)} color="primary">
            <FiDownload />
          </IconButton>
          <IconButton onClick={() => setShowFilterDrawer(true)} color="primary">
            <FiFilter />
          </IconButton>
        </Box>
      </Paper>


      {/* Total Expenses Card */}
      <Card sx={{ mt: 3, p: 2, background: "linear-gradient(to right, #2196F3, #21CBF3)", color: "#fff", textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Total Expenses: ₹{filteredExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976D2", color: "#fff" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Source</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description || "No Description"}</TableCell>
                  <TableCell
          sx={{
            fontWeight: "bold",
            color: expense.amount < 0 ? "green" : "red",
          }}
        >
          {expense.amount < 0 ? (
            <>
              <ArrowDownward fontSize="small" /> ₹{Math.abs(expense.amount)}
            </>
          ) : (
            <>
              <ArrowUpward fontSize="small" /> ₹{expense.amount}
            </>
          )}
        </TableCell>
                  <TableCell>{expense.source || "N/A"}</TableCell>
                  <TableCell>{new Date(expense.createdAt.seconds * 1000).toISOString().split("T")[0]}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => { setEditExpense(expense); setShowModal(true); }} color="primary">
                      <FiEdit />
                    </IconButton>
                    <IconButton onClick={() => { setExpenseToDelete(expense); setShowConfirmModal(true); }} color="error">
                      <FiTrash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Components */}
      <FilterDrawer open={showFilterDrawer} onClose={() => setShowFilterDrawer(false)} filter={filter} setFilter={setFilter} applyFilters={applyFilters} resetFilters={resetFilters} />
      <AddExpenseDrawer isOpen={showDrawer} onClose={handleAddExpenseDrawerClose} />
      <ExportToExcel filteredExpenses={filteredExpenses} show={showExportModal} onClose={() => setShowExportModal(false)} />
      {showModal && <Modal expense={editExpense} onClose={() => setShowModal(false)} onSave={handleUpdateExpense} />}
      <ConfirmationModal open={showConfirmModal} onClose={() => setShowConfirmModal(false)} onConfirm={handleDeleteExpense} />
    </Box>
  );
};

export default Home;
