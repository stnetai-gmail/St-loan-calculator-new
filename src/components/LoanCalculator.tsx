import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Calendar, Percent } from 'lucide-react';

interface PaymentSchedule {
  paymentNumber: number;
  paymentAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
}

interface LoanSummary {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalAmount: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('250000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [loanTermMonths, setLoanTermMonths] = useState<string>('360');
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const months = parseInt(loanTermMonths);

    if (!principal || !annualRate || !months || principal <= 0 || annualRate < 0 || months <= 0) {
      setPaymentSchedule([]);
      setLoanSummary(null);
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0 
      ? principal / months 
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    let remainingBalance = principal;
    const schedule: PaymentSchedule[] = [];

    for (let i = 1; i <= months; i++) {
      const interestAmount = remainingBalance * monthlyRate;
      const principalAmount = monthlyPayment - interestAmount;
      remainingBalance = Math.max(0, remainingBalance - principalAmount);

      schedule.push({
        paymentNumber: i,
        paymentAmount: monthlyPayment,
        principalAmount,
        interestAmount,
        remainingBalance,
      });

      if (remainingBalance === 0) break;
    }

    const totalPayments = monthlyPayment * months;
    const totalInterest = totalPayments - principal;

    setPaymentSchedule(schedule);
    setLoanSummary({
      monthlyPayment,
      totalPayments,
      totalInterest,
      totalAmount: totalPayments,
    });
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTermMonths]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Loan Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Calculate your monthly payments and view complete repayment schedule</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                Loan Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="250000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Interest Rate (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="4.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (months)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={loanTermMonths}
                      onChange={(e) => setLoanTermMonths(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="360"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {loanTermMonths ? `${Math.round(parseInt(loanTermMonths) / 12)} years` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Summary */}
            {loanSummary && (
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Monthly Payment</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(loanSummary.monthlyPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(loanSummary.totalInterest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(loanSummary.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Payment Schedule</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {paymentSchedule.length > 0 ? `${formatNumber(paymentSchedule.length)} payments` : 'Enter loan details to see schedule'}
                </p>
              </div>

              <div className="overflow-x-auto max-h-96">
                {paymentSchedule.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment #
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paymentSchedule.map((payment, index) => (
                        <tr key={payment.paymentNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {payment.paymentNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(payment.paymentAmount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-green-600 text-right font-medium">
                            {formatCurrency(payment.principalAmount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-orange-600 text-right font-medium">
                            {formatCurrency(payment.interestAmount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {formatCurrency(payment.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Enter loan details to generate payment schedule</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}