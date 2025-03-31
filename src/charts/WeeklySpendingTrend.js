import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography, Box, FormControl, Select, MenuItem, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { db, auth } from "../database";
import { collection, getDocs, where , query} from "firebase/firestore";

const WeeklySpendingTrend = () => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "short" }));
  const [viewType, setViewType] = useState("weekly"); // Default to Weekly View
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (!user) return; // Ensure user is authenticated before proceeding
    
      try {
        // Querying expenses only for the current user
        const expensesRef = collection(db, "expenses");
        const q = query(expensesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const yearlyData = {};
    
        querySnapshot.forEach((doc) => {
          const { amount, createdAt } = doc.data();
          const date = new Date(createdAt.seconds * 1000);
          const year = date.getFullYear();
          const month = date.toLocaleString("default", { month: "short" });
          const week = `Week ${Math.ceil(date.getDate() / 7)}`;
    
          if (!yearlyData[year]) yearlyData[year] = { weekly: {} };
          if (!yearlyData[year].weekly[month]) yearlyData[year].weekly[month] = {};
    
          yearlyData[year].weekly[month][week] = (yearlyData[year].weekly[month][week] || 0) + amount;
        });
    
        setYears(Object.keys(yearlyData).map((year) => parseInt(year, 10)));
        setData(yearlyData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    

    fetchExpenses();
  }, []);

  // Update available months when year changes
  useEffect(() => {
    if (data[selectedYear]) {
      setMonths(Object.keys(data[selectedYear].weekly));
      setSelectedMonth(new Date().toLocaleString("default", { month: "short" })); // Default to current month
    }
  }, [selectedYear, data]);

  let chartData = [];
  if (data[selectedYear] && viewType === "weekly" && selectedMonth) {
    chartData = Object.entries(data[selectedYear].weekly[selectedMonth] || {}).map(([key, value]) => ({ name: key, value }));
  } else if (data[selectedYear] && viewType === "yearly") {
    chartData = Object.entries(data[selectedYear].weekly).map(([month, weekData]) => ({
      name: month,
      value: Object.values(weekData).reduce((sum, v) => sum + v, 0),
    }));
  }

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: 2,
        margin: 2,
      }}
    >
      <CardContent>
        {/* Title & Filters */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            Spending Trend Analysis
          </Typography>

          {/* Year Selection */}
          <FormControl sx={{ minWidth: 100 }}>
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* View Type Toggle (Only Yearly & Weekly) */}
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={(e, newValue) => newValue && setViewType(newValue)}
            size="small"
          >
            <ToggleButton value="yearly">Yearly</ToggleButton>
            <ToggleButton value="weekly">Monthly</ToggleButton>
          </ToggleButtonGroup>

          {/* Month Selection (only visible when Weekly is selected) */}
          {viewType === "weekly" && (
            <FormControl sx={{ minWidth: 100 }}>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Chart */}
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip wrapperStyle={{ backgroundColor: "#fff", borderRadius: 8, padding: 10 }} />
              <Legend />
              <Bar dataKey="value" fill="url(#colorGradient)" barSize={40} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.9} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklySpendingTrend;
