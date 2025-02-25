import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import { db } from "../database";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
    };

    fetchTransactions();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#fff", borderRadius: 3, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", padding: 2, margin: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
        Recent Transactions
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Source</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{new Date(transaction.createdAt.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.source}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentTransactions;
