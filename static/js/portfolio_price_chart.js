// portfolio_price_chart.js

// Define your CoinCap API key
const priceKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; // Replace with your actual CoinCap API key

// Import the fetchCryptoData function from your portfolio.js
import { fetchCryptoData } from './portfolio.js';

// Function to populate the asset dropdown
function populateAssetDropdown() {
    const assetSelect = document.getElementById('asset-select');

    // Call the fetchCryptoData function to get the list of assets
    const cryptoData = fetchCryptoData();

    // Populate the asset dropdown with the fetched data
    cryptoData.forEach(crypto => {
        const option = document.createElement('option');
        option.value = crypto.id;
        option.text = crypto.symbol;
        assetSelect.appendChild(option);
    });

    // Add an event listener to the asset dropdown to fetch and update the chart when an asset is selected
    assetSelect.addEventListener('change', fetchAssetPriceData);
}

// Function to fetch historical price data for the selected asset
async function fetchAssetPriceData() {
    const assetSelect = document.getElementById('asset-select');
    const selectedAssetId = assetSelect.value;

    if (selectedAssetId) {
        const assetPriceUrl = `https://api.coincap.io/v2/assets/${selectedAssetId}/history?interval=d1`;

        try {
            const response = await fetch(assetPriceUrl, {
                headers: {
                    'Authorization': `Bearer ${priceKey}`
                }
            });
            const data = await response.json();

            // Process and draw the chart using the fetched data
            // (This part can remain similar to your existing fetchBitcoinPriceData function)
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
            console.error('Error fetching asset price data:', error);
        }
    }
}

// Load Google Charts library and call the function
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(fetchBitcoinPriceData);

// Call the populateAssetDropdown function to initialize the dropdown
populateAssetDropdown();

