// crypto_prices.js

const apiKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; // Replace with your CoinCap API key
const apiUrl = 'https://api.coincap.io/v2/assets';

// Function to fetch cryptocurrency data
async function fetchCryptoData() {
    try {
        const response = await fetch(`${apiUrl}?limit=500`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        const data = await response.json();
        
        // Get the table body where cryptocurrency data will be populated
        const cryptoTableBody = document.getElementById('crypto-list');

        data.data.forEach(crypto => {
            const cryptoName = crypto.name;
            const cryptoSymbol = crypto.symbol;
            const cryptoPrice = crypto.priceUsd;
            const cryptoChangePercent24Hr = crypto.changePercent24Hr;

            // Create a table row for each cryptocurrency
            const cryptoTableRow = document.createElement('tr');

            // Populate the table columns with cryptocurrency data
            cryptoTableRow.innerHTML = `
                <td>${cryptoName}</td>
                <td>${cryptoSymbol}</td>
                <td>$${cryptoPrice}</td>
                <td>${cryptoChangePercent24Hr}%</td>
            `;

            // Append the row to the table body
            cryptoTableBody.appendChild(cryptoTableRow);
        });
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
    }
}

// Call the fetchCryptoData function to populate the table
fetchCryptoData();

