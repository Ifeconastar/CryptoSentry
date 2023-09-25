const dataKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; 
const dataUrl = 'https://api.coincap.io/v2/assets';


// Function to fetch cryptocurrency data (id)
async function populateAssetDropdown() {
    try {
        const response = await fetch(`${dataUrl}?limit=500`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${dataKey}`,
            },
        });
        const data = await response.json();

        // Extract id and symbol data
        const cryptoData = data.data.map(crypto => ({
            id: crypto.id
        }));

        // Populate dropdown
        const assetSelect = document.getElementById('asset-select');
        

        cryptoData.forEach(crypto => {
            const Option = document.createElement('option');
            Option.value = crypto.id; // Use the id as the value
            Option.text = crypto.id; // Display the id in the asset dropdown

            assetSelect.appendChild(Option);
        });
		// Add an event listener to the asset dropdown to fetch and update the chart when an asset is selected
    assetSelect.addEventListener('change', fetchAssetPriceData);
	} catch (error) {
                    console.error('Error fetching crptocurrency data:', error);
    }
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
                    'Authorization': `Bearer ${dataKey}`
                }
            });
            const data = await response.json();

            // Process and draw the chart using the fetched data
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
            title: 'Cryptocurrency Price Chart',
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
google.charts.setOnLoadCallback(fetchAssetPriceData);

// Call the populateAssetDropdown function to initialize the dropdown
populateAssetDropdown();
