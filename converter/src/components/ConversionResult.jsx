import React from 'react';

function ConversionResult({ convertedAmount, toCurrency, exchangeRate, lastUpdated }) {
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-md">
      {convertedAmount !== null && (
        <p className="text-lg font-semibold">
          {convertedAmount} {toCurrency}
        </p>
      )}
      {exchangeRate && exchangeRate.rates && exchangeRate.rates[toCurrency] && (
        <p className="text-sm text-gray-600 mt-2">
          1 {exchangeRate.base_code} = {exchangeRate.rates[toCurrency]} {toCurrency}
        </p>
      )}
      {lastUpdated && (
        <p className="text-xs text-gray-500 mt-1">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
      {!exchangeRate && !loading && error && (
        <p className="text-sm text-red-500 mt-2">
          Error fetching exchange rate. Please try again.
        </p>
      )}
      {loading && <p className="text-sm text-gray-500 mt-2">Fetching exchange rate...</p>}
      {!exchangeRate && !loading && !error && toCurrency && fromCurrency && (
        <p className="text-sm text-gray-500 mt-2">
          Select an amount to convert from {fromCurrency} to {toCurrency}.
        </p>
      )}
    </div>
  );
}

export default ConversionResult;