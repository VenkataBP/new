import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto'; 
import './App.css'; 

function LoanDashboard() {
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [interestType, setInterestType] = useState('simple');
    const [calculatedInterest, setCalculatedInterest] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Portfolio Value',
                data: [],
                backgroundColor: 'rgba(249, 199, 79, 0.5)', 
                borderColor: 'rgba(249, 199, 79, 1)', 
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Earnings',
                data: [],
                backgroundColor: 'rgba(0, 123, 255, 0.5)', 
                borderColor: 'rgba(0, 123, 255, 1)', 
                borderWidth: 2,
                fill: true,
            }
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const loanAmount = parseFloat(amount);
        const interestRate = parseFloat(rate);
        const loanTime = parseFloat(time);

        let interest = 0;

        if (interestType === 'simple') {
            interest = (loanAmount * interestRate * loanTime) / 100;
        } else {
            interest = loanAmount * Math.pow((1 + interestRate / 100), loanTime) - loanAmount;
        }

        const newPortfolioValue = loanAmount + interest;
        const newEarnings = interest;

        setCalculatedInterest(interest);
        setPortfolioValue(newPortfolioValue);
        setEarnings(newEarnings);

        // Update transaction history
        setTransactionHistory([...transactionHistory, `Loan: ₹${loanAmount}, Interest: ₹${interest.toFixed(2)}`]);

        // Update chart data
        const newLabels = [...chartData.labels, `Year ${loanTime}`];
        const newPortfolioValues = [...chartData.datasets[0].data, newPortfolioValue];
        const newEarningsValues = [...chartData.datasets[1].data, newEarnings];

        setChartData({
            ...chartData,
            labels: newLabels,
            datasets: [
                { ...chartData.datasets[0], data: newPortfolioValues },
                { ...chartData.datasets[1], data: newEarningsValues },
            ],
        });

        // Reset form
        setAmount('');
        setRate('');
        setTime('');
    };

    return (
        <div className="container">
            <header className="text-center mt-4">
                <h1 className="display-4 text-primary">Loan Dashboard</h1>
            </header>

            <section className="mt-5">
                <div className="card bg-light border-info">
                    <div className="card-header bg-info text-white">
                        <h2>Interest Calculator</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="amount">Loan Amount:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rate">Interest Rate (%):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="rate"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">Time (years):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Interest Type:</label>
                                <select
                                    className="form-control"
                                    id="type"
                                    value={interestType}
                                    onChange={(e) => setInterestType(e.target.value)}
                                >
                                    <option value="simple">Simple Interest</option>
                                    <option value="compound">Compound Interest</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Calculate Interest</button>
                        </form>
                        <div className="mt-3">
                            <h4>Calculated Interest: <span id="result" className="text-success">₹{calculatedInterest.toFixed(2)}</span></h4>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-5">
                <div className="card bg-light border-success">
                    <div className="card-header bg-success text-white">
                        <h2>Loan Insights</h2>
                    </div>
                    <div className="card-body">
                        <h5>Total Portfolio Value: <span id="portfolioValue" className="text-primary">₹{portfolioValue.toFixed(2)}</span></h5>
                        <h5>Earnings: <span id="earnings" className="text-primary">₹{earnings.toFixed(2)}</span></h5>
                        <h5>Transaction History:</h5>
                        <ul className="list-group">
                            {transactionHistory.map((item, index) => (
                                <li key={index} className="list-group-item">{item}</li>
                            ))}
                        </ul>
                        <Bar data={chartData} options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#333', // Legend text color
                                    },
                                },
                                title: {
                                    display: true,
                                    text: 'Portfolio and Earnings Over Time',
                                    color: '#333', // Title text color
                                }
                            },
                        }} className="mt-4" />
                    </div>
                </div>
            </section>

            <footer className="text-center mt-5 mb-4">
                <p>&copy; 2024 Loan Dashboard. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default LoanDashboard;
