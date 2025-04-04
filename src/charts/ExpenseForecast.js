import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { collection, getDocs, where } from "firebase/firestore";
import { db , auth} from "../database";
import { Card } from "react-bootstrap";

const ExpenseForecast = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const user = auth.currentUser;
      if (!user) return; // Ensure user is authenticated before proceeding
    
      try {
        // Querying expenses only for the current user
        const expensesRef = collection(db, "expenses");
        const q = query(expensesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const expenses = querySnapshot.docs.map(doc => doc.data());
    
        const monthlyExpenses = expenses.reduce((acc, expense) => {
          const date = new Date(expense.createdAt.seconds * 1000);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          acc[month] = (acc[month] || 0) + expense.amount;
          return acc;
        }, {});
    
        setData(Object.keys(monthlyExpenses).map(month => ({ month, amount: monthlyExpenses[month] })));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    

    fetchExpenses();
  }, []);

  return (
    <Card className="p-3 shadow-sm">
      <Card.Title>Expense Forecast</Card.Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#FF5733" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ExpenseForecast;
