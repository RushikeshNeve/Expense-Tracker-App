import React, { useState } from "react";

const Modal = ({ expense, onClose, onSave }) => {
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [source, setSource] = useState(expense.source);
  const [description, setDescription] = useState(expense.description);

  const handleSave = () => {
    onSave({ ...expense, amount: parseFloat(amount), category, source, description });
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Expense</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Amount</label>
            <input type="number" className="form-control mb-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <label className="form-label">Category</label>
            <input type="text" className="form-control mb-2" value={category} onChange={(e) => setCategory(e.target.value)} />
            <label className="form-label">Source</label>
            <input type="text" className="form-control mb-2" value={source} onChange={(e) => setSource(e.target.value)} />
            <label className="form-label">Description</label>
            <input type="text" className="form-control mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
