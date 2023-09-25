// price_chart.js

// Define your CoinCap API key
const priceKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; // Replace with your actual CoinCap API key

// Define the API endpoint for Bitcoin's historical price data
const priceUrl = 'https://api.coincap.io/v2/assets/bitcoin/history?interval=d1';

// Function to fetch and process historical price data
async function fetchBitcoinPriceData() {
    try {
        const response = await fetch(priceUrl, {
            headers: {
                'Authorization': `Bearer ${priceKey}`
            }
        });
        const data = await response.json();

        // Extract relevant data points (close prices)
        const chartData = data.data.map(item => {
            return [
                new Date(item.time),
                parseFloat(item.priceUsd)
            ];
        });

        // Create the DataTable for the chart
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('date', 'Date');
        dataTable.addColumn('number', 'Close Price (USD)');
        dataTable.addRows(chartData);

        // Define chart options
        const options = {
            title: 'Bitcoin Close Price Chart',
            legend: { position: 'none' }, // Hide legend
            backgroundColor: {
                fill: 'transparent'
            },
            curveType: 'function', // Use line chart
            hAxis: {
                title: 'Date',
                titleTextStyle: {
                    color: '#333'
                },
                textStyle: {
                    color: '#666'
                },
            },
            vAxis: {
                title: 'Price (USD)',
                titleTextStyle: {
                    color: '#333'
                },
                textStyle: {
                    color: '#666'
                },
                minValue: 0,
            },
        };

        // Create and draw the line chart
        const chart = new google.visualization.LineChart(document.getElementById('price-chart'));
        chart.draw(dataTable, options);
    } catch (error) {
        console.error('Error fetching Bitcoin price data:', error);
    }
}

// Load Google Charts library and call the function
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(fetchBitcoinPriceData);

