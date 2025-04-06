import { useState, useEffect } from 'react'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [exchangeRate, setExchangeRate] = useState(null)
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY']

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1)
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
          { signal: controller.signal }
        )
        const data = await response.json()
        setExchangeRate(data.rates[toCurrency])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to fetch rates. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeRate()
    return () => controller.abort()
  }, [fromCurrency, toCurrency])

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(2))
    }
  }, [amount, exchangeRate])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Currency Converter
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            min="0"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            >
              {currencies.map((c) => (
                <option key={`from-${c}`} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Swap currencies"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary"
            >
              {currencies.map((c) => (
                <option key={`to-${c}`} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">Converted Amount</p>
              <p className="text-2xl font-semibold text-gray-800">
                {convertedAmount} {toCurrency}
              </p>
              {exchangeRate && (
                <p className="text-sm text-gray-500 mt-1">
                  1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}