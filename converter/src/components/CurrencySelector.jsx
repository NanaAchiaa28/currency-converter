import React from 'react';

function CurrencySelector({ currencies, selectedCurrency, onChange, label }) {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <select
        id={label}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={selectedCurrency}
        onChange={onChange}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;