import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencySelector from './components/CurrencySelector';
import AmountInput from './components/AmountInput';
import ConversionResult from './components/ConversionResult';

const API_KEY = '541d9d4c5998ac4519ade5ad';
const API_URL = 'https://v6.exchangerate-api.com/v6';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false); // Define the loading state
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/${API_KEY}/codes`);
        setCurrencies(response.data.supported_codes.map(code => code[0]));
      } catch (err) {
        setError('Failed to fetch currencies. Please check your internet connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency && toCurrency) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}`);
          if (response.data.result === 'success') {
            setExchangeRate(response.data);
            setLastUpdated(response.data.time_last_update_utc);
            const converted = amount * response.data.conversion_rate;
            setConvertedAmount(converted.toFixed(2));
          } else {
            setError('Failed to fetch exchange rate for the selected currencies.');
            setConvertedAmount(null);
            setExchangeRate(null);
          }
        } catch (err) {
          setError('Failed to fetch exchange rate. Please check your internet connection.');
          console.error(err);
          setConvertedAmount(null);
          setExchangeRate(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency, amount]);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (value) => {
    setAmount(value ? parseFloat(value) : 0);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Currency Converter</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Loading...</p>} {/* This loading is in App */}

      {!loading && currencies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencySelector
            label="From Currency"
            currencies={currencies}
            selectedCurrency={fromCurrency}
            onChange={handleFromCurrencyChange}
          />
          <CurrencySelector
            label="To Currency"
            currencies={currencies}
            selectedCurrency={toCurrency}
            onChange={handleToCurrencyChange}
          />
        </div>
      )}

      <AmountInput amount={amount} onAmountChange={handleAmountChange} />

      <ConversionResult
        convertedAmount={convertedAmount}
        toCurrency={toCurrency}
        exchangeRate={exchangeRate}
        lastUpdated={lastUpdated}
        loading={loading} // Pass the loading state as a prop
        error={error}     // Also pass the error state as a prop (you were already doing this implicitly in the JSX)
        fromCurrency={fromCurrency} // Pass fromCurrency as well for the instructional message
      />
    </div>
  );
}

export default App;