import React from 'react';
function AmountInput({ amount, onAmountChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
        Amount:
      </label>
      <input
        type="number"
        id="amount"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
    </div>
  );
}

export default AmountInput;