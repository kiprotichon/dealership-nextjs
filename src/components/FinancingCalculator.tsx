'use client';

import { useState, useMemo } from 'react';
import { Calculator, Banknote, Percent, Calendar } from 'lucide-react';

interface FinancingCalculatorProps {
  /** Pre-fill with the vehicle price when used on a detail page */
  defaultPrice?: number;
  className?: string;
}

function formatKES(value: number) {
  return 'KSh ' + Math.round(value).toLocaleString();
}

export default function FinancingCalculator({ defaultPrice = 0, className = '' }: FinancingCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice || 2500000);
  const [downPayment, setDownPayment] = useState(Math.round((defaultPrice || 2500000) * 0.2));
  const [termMonths, setTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(14); // typical Kenya bank rate range

  const results = useMemo(() => {
    const principal = Math.max(0, price - downPayment);
    const monthlyRate = interestRate / 100 / 12;

    let monthlyPayment = 0;
    if (principal > 0 && termMonths > 0) {
      if (monthlyRate === 0) {
        monthlyPayment = principal / termMonths;
      } else {
        // Standard amortizing loan formula
        monthlyPayment =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1);
      }
    }

    const totalPayable = monthlyPayment * termMonths;
    const totalInterest = totalPayable - principal;

    return {
      principal,
      monthlyPayment,
      totalPayable,
      totalInterest,
      downPaymentPercent: price > 0 ? (downPayment / price) * 100 : 0
    };
  }, [price, downPayment, termMonths, interestRate]);

  function handlePriceChange(val: number) {
    setPrice(val);
    // Keep down payment roughly 20% when price changes significantly
    if (Math.abs(downPayment - val * 0.2) > val * 0.05) {
      setDownPayment(Math.round(val * 0.2));
    }
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-white">Financing Calculator</h3>
          <p className="text-xs text-gray-400">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Vehicle Price */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
            <Banknote className="h-4 w-4 text-accent" />
            Vehicle Price (KSh)
          </label>
          <input
            type="number"
            min={0}
            step={50000}
            value={price || ''}
            onChange={e => handlePriceChange(Number(e.target.value) || 0)}
            className="input"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Banknote className="h-4 w-4 text-accent" />
              Down Payment (KSh)
            </label>
            <span className="text-xs font-medium text-accent">
              {results.downPaymentPercent.toFixed(0)}%
            </span>
          </div>
          <input
            type="number"
            min={0}
            max={price}
            step={25000}
            value={downPayment || ''}
            onChange={e => setDownPayment(Number(e.target.value) || 0)}
            className="input"
          />
          <input
            type="range"
            min={0}
            max={price || 1}
            step={10000}
            value={Math.min(downPayment, price)}
            onChange={e => setDownPayment(Number(e.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
            <Calendar className="h-4 w-4 text-accent" />
            Loan Term
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[12, 24, 36, 48, 60, 72].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setTermMonths(m)}
                className={`rounded-lg py-2 text-sm font-medium transition ${
                  termMonths === m
                    ? 'bg-accent text-primary'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m / 12} yr
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Percent className="h-4 w-4 text-accent" />
              Interest Rate (p.a.)
            </label>
            <span className="text-sm font-bold text-primary">{interestRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={25}
            step={0.5}
            value={interestRate}
            onChange={e => setInterestRate(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">Estimated monthly payment</span>
            <span className="text-2xl font-extrabold text-primary">
              {formatKES(results.monthlyPayment)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Loan amount</p>
              <p className="font-semibold text-primary">{formatKES(results.principal)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total interest</p>
              <p className="font-semibold text-primary">{formatKES(results.totalInterest)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Total payable</p>
              <p className="font-semibold text-primary">{formatKES(results.totalPayable)}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          This is an estimate only. Actual rates and terms depend on the bank, your credit profile and the vehicle. Contact us for a personalized quote.
        </p>

        <a
          href="https://wa.me/254715455098?text=Hi%2C%20I%27d%20like%20a%20financing%20quote%20for%20a%20vehicle"
          target="_blank"
          rel="noreferrer"
          className="btn w-full text-center block text-sm"
        >
          Get a real quote on WhatsApp
        </a>
      </div>
    </div>
  );
}
