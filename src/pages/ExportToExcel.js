import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = ({ filteredExpenses, show, onClose }) => {
  const [fileName, setFileName] = useState("");

  const handleExportToExcel = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    // Prepare data for export
    const dataToExport = filteredExpenses.map((expense) => ({
      Category: expense.category,
      Description: expense.description || "No Description",
      Amount: expense.amount,
      Source: expense.source || "N/A",
      Date: new Date(expense.createdAt.seconds * 1000).toISOString().split("T")[0],
    }));

    // Create a new worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    // Set filename (use user input or default)
    const exportFileName = fileName.trim() ? `${fileName}.xlsx` : `Expenses_${new Date().toISOString().split("T")[0]}.xlsx`;

    // Write and download the Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(excelBlob, exportFileName);

    onClose(); // Close modal after export
  };

  return (
    <>
      {show && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Expenses to Excel</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter file name (optional)"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleExportToExcel}>
                  Export to Excel 📊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportToExcel;
