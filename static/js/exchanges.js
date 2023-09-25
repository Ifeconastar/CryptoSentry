// exchanges.js

const myKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; // Replace with your CoinCap API key
const exchangesUrl = 'https://api.coincap.io/v2/exchanges';

// Function to fetch exchange data
async function fetchExchangeData() {
    try {
        const response = await fetch(exchangesUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${myKey}`,
            },
        });
        const data = await response.json();

        // Get the table body where exchange data will be populated
        const exchangeTableBody = document.getElementById('exchange-list');

        data.data.forEach(exchange => {
            const exchangeName = exchange.name;
            const exchangeVolumeUsd = exchange.volumeUsd;
            const exchangeTradingPairs = exchange.tradingPairs;
            const exchangeExchangeUrl = exchange.exchangeUrl;

            // Create a table row for each exchange
            const exchangeTableRow = document.createElement('tr');

            // Populate the table columns with exchange data
            exchangeTableRow.innerHTML = `
                <td>${exchangeName}</td>
                <td>$${exchangeVolumeUsd}</td>
                <td>${exchangeTradingPairs}</td>
                <td><a href="${exchangeExchangeUrl}" target="_blank">${exchangeExchangeUrl}</a></td>
            `;

            // Append the row to the table body
            exchangeTableBody.appendChild(exchangeTableRow);
        });
    } catch (error) {
        console.error('Error fetching exchange data:', error);
    }
}

// Call the fetchExchangeData function to populate the exchange table
fetchExchangeData();

