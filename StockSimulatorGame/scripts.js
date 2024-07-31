console.log("Script loaded successfully!");

let round = 1;
const maxRounds = 5;
let totalScore = 0;
let stockPrices = [];
let nextDayPrice;
let barChart;

// Generate random stock prices with whole numbers or .5 only
function generateRandomPrices() {
    let prices = [];
    for (let i = 0; i < 10; i++) {
        prices.push(Math.round((Math.random() * 50 + 100) * 2) / 2);
    }
    return {
        prices: prices,
        nextDayPrice: Math.round((Math.random() * 50 + 100) * 2) / 2
    };
}

// Initialize or update the chart
function updateChart() {
    if (barChart) {
        barChart.data.labels = stockPrices.map((_, index) => `Day ${index + 1}`);
        barChart.data.datasets[0].data = stockPrices;
        barChart.update();
    } else {
        let ctx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stockPrices.map((_, index) => `Day ${index + 1}`),
                datasets: [{
                    label: 'Stock Prices',
                    data: stockPrices,
                    backgroundColor: 'rgba(52, 152, 219, 0.6)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Display the average price and strategy
function displayAverageAndStrategy() {
    const average = stockPrices.reduce((acc, price) => acc + price, 0) / stockPrices.length;
    const trend = stockPrices[stockPrices.length - 1] > stockPrices[0] ? 
        'increasing' : 'decreasing';
    const strategy = trend === 'increasing' ? 
        'The price has been increasing. Try predicting a value slightly above the average.' : 
        'The price has been decreasing. Try predicting a value slightly below the average.';

    document.getElementById('average').textContent = `Average Price: ${Math.round(average * 2) / 2}`;
    document.getElementById('strategy').textContent = `Strategy: ${strategy}`;
}

// Handle prediction submission
function submitPrediction() {
    const prediction = parseFloat(document.getElementById('prediction').value);
    const feedback = document.getElementById('feedback');

    if (!isNaN(prediction)) {
        if (prediction === nextDayPrice) {
            feedback.textContent = 'Correct! Great job!';
            totalScore++;
        } else {
            feedback.textContent = `Incorrect. The correct price was ${nextDayPrice}. Try considering the average price and the trend to improve your prediction next time.`;
        }
    } else {
        feedback.textContent = 'Please enter a valid number.';
    }

    document.getElementById('score').textContent = 'Total Score: ' + totalScore;

    if (round < maxRounds) {
        round++;
        document.getElementById('round').textContent = 'Round: ' + round + '/' + maxRounds;
        startNewRound();
    } else {
        feedback.textContent += ' Game Over! Your total score is ' + totalScore;
        document.getElementById('prediction').disabled = true;
        document.querySelector('button').disabled = true;
    }
}

// Start a new round
function startNewRound() {
    ({ prices: stockPrices, nextDayPrice } = generateRandomPrices());
    updateChart();
    displayAverageAndStrategy();
}

// Initial setup
startNewRound();
document.getElementById('round').textContent = 'Round: ' + round + '/' + maxRounds;
