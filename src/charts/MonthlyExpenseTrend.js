import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FormControl, Select, MenuItem, Typography, Box } from "@mui/material";
import { db, auth } from "../database";
import { collection, getDocs, where, query} from "firebase/firestore";

const MonthlyExpenseTrend = () => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (!user) return; // Ensure user is authenticated before proceeding
    
      try {
        // Querying expenses only for the current user
        const expensesRef = collection(db, "expenses");
        const q = query(expensesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const expenseData = {};
    
        querySnapshot.forEach((doc) => {
          const { amount, createdAt } = doc.data();
          const date = new Date(createdAt.seconds * 1000);
          const year = date.getFullYear();
          const month = date.toLocaleString("default", { month: "short" });
    
          if (!expenseData[year]) {
            expenseData[year] = {};
          }
          expenseData[year][month] = (expenseData[year][month] || 0) + amount;
        });
    
        setYears(Object.keys(expenseData).map((year) => parseInt(year, 10)));
        setData(expenseData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Prepare data for selected year
  const chartData =
    data[selectedYear] &&
    Object.entries(data[selectedYear]).map(([month, value]) => ({ name: month, value }));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Title & Year Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={2} px={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          Monthly Expense Trend
        </Typography>

        {/* Year Dropdown */}
        <FormControl sx={{ minWidth: 100 }}>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{ backgroundColor: "#fff", borderRadius: 2 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Chart */}
      <Box sx={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip wrapperStyle={{ backgroundColor: "#fff", color: "#333", borderRadius: 8, padding: 10 }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="rgba(136, 132, 216, 0.8)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default MonthlyExpenseTrend;
