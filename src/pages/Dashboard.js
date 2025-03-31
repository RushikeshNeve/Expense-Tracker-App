import React, { useEffect, useState } from "react";
import { Grid, Container, CircularProgress, Card, CardContent, Typography, Box} from "@mui/material";
import { db, auth } from "../database";
import { collection, getDocs, where, query }from "firebase/firestore";
import StatCard from "../components/StatCard";
import CategoryWiseExpense from "../charts/CategoryWiseExpense";
import MonthlyExpenseTrend from "../charts/MonthlyExpenseTrend";
import RecentTransactions from "./RecentTransactions";
import TabComponent from "../components/Tabs";

const Dashboard = () => {
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [numExpenses, setNumExpenses] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        console.log(user)
        // Fetching expenses only for the current user
        const expensesRef = collection(db, "expenses");
        const q = query(expensesRef, where("userId", "==", user.uid));
        const expensesSnapshot = await getDocs(q);
  
        const expenses = expensesSnapshot.docs.map((doc) => doc.data());
        console.log(expenses);
  
        setTotalExpenses(expenses.length ? expenses.reduce((sum, exp) => sum + exp.amount, 0) : 0);
        setNumExpenses(expenses.length || 0);
  
        // Fetching categories for the current user
        const categoriesRef = collection(db, "categories");
        const categoriesQuery = query(categoriesRef);
        const categoriesSnapshot = await getDocs(categoriesQuery);
  
        setTotalCategories(categoriesSnapshot.size || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;

  return (
    
    <Container>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Dashboard
      </Typography>
      
      {/* Navigation Tabs */}
      <TabComponent />

      {/* Stat Cards */}
      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Expenses" value={`₹${totalExpenses}`} change="Updated now" color="linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Transactions" value={numExpenses} change="Across all categories" color="linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Categories" value={totalCategories} change="Categorized expenses" color="linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)" />
        </Grid>
      </Grid>

      {/* Graphs Section */}
      <Grid container spacing={3} mt={6}>
        {/* Yearly Expenses Chart - Adjusted Size */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ width: "100%", height: 280 }}> 
                <MonthlyExpenseTrend />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category-wise Donut Chart - Adjusted Size */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ width: "100%", height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CategoryWiseExpense hideAnalysisToggle={true} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card sx={{ height: 375, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <RecentTransactions />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
