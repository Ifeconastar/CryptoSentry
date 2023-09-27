// portfolio.js

const portfolioKey = 'a8b025b8-656a-4bf7-9f64-1b2bfa64a6e6'; 
const portfolioUrl = 'https://api.coincap.io/v2/assets';

let roundedprice;

// Function to fetch cryptocurrency data (id and symbol)
async function fetchCryptoData() {
    try {
        const response = await fetch(`${portfolioUrl}?limit=500`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${portfolioKey}`,
            },
        });
        const data = await response.json();

        // Extract id and symbol data
        const cryptoData = data.data.map(crypto => ({
            id: crypto.id,
            symbol: crypto.symbol,
        }));

        // Populate dropdowns and purchase price field
        const assetDropdown = document.getElementById('asset');
        const symbolDropdown = document.getElementById('symbol');
        const purchasePriceInput = document.getElementById('purchase-price');

        cryptoData.forEach(crypto => {
            const assetOption = document.createElement('option');
            assetOption.value = crypto.id; // Use the id as the value
            assetOption.text = crypto.id; // Display the id in the asset dropdown

            const symbolOption = document.createElement('option');
            symbolOption.value = crypto.symbol; // Use the symbol as the value
            symbolOption.text = crypto.symbol; // Display the symbol in the symbol dropdown

            assetDropdown.appendChild(assetOption);
            symbolDropdown.appendChild(symbolOption);
        });

        // Add event listener to fetch purchase price when asset is selected
        assetDropdown.addEventListener('change', async () => {
            const selectedAssetId = assetDropdown.value;
            if (selectedAssetId) {
                // Fetch the purchase price and populate the field
                try {
                    const assetResponse = await fetch(`${portfolioUrl}/${selectedAssetId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${portfolioKey}`,
                        },
                    });
                    const assetData = await assetResponse.json();

                    if (assetData.data) {
                        const priceUsd =parseFloat(assetData.data.priceUsd);
                        roundedprice = priceUsd;
						purchasePriceInput.value = roundedprice.toFixed(2); 
                    }
                } catch (error) {
                    console.error('Error fetching purchase price:', error);
                }
            } else {
                // Clear the purchase price field if no asset is selected
                purchasePriceInput.value = '';
            }
        });
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        return [];
    }
}


// Initialize the dropdowns and purchase price field
fetchCryptoData();


// Function to calculate total value
function calculateTotalValue() {
    const purchasePriceInput = document.getElementById('purchase-price');
    const quantityInput = document.getElementById('quantity');
    const totalValueInput = document.getElementById('total-value');

    const purchasePrice = parseFloat(purchasePriceInput.value);
    const quantity = parseFloat(quantityInput.value);

    if (!isNaN(purchasePrice) && !isNaN(quantity)) {
        const totalValue = purchasePrice * quantity;
        totalValueInput.value = totalValue.toFixed(2); // Format to 2 decimal places
    } else {
        // Clear total value if either input is invalid
        totalValueInput.value = '';
    }
}

    
	
// Add event listeners to calculate total value when purchase price or quantity changes
const purchasePriceInput = document.getElementById('purchase-price');
const quantityInput = document.getElementById('quantity');

purchasePriceInput.addEventListener('input', calculateTotalValue);
quantityInput.addEventListener('input', calculateTotalValue);

// Function to check if the table is empty and calculate net worth
function checkTable() {
    const portfolioTable = document.getElementById('portfolio-table');
    const netWorthDiv = document.getElementById('net-worth');
    
    console.log('portfolioTable:', portfolioTable);
    console.log('netWorthDiv:', netWorthDiv);

    if (!portfolioTable || !netWorthDiv) {
        console.error("Table element or Net Worth div element not found.");
        return;
    }

    const rows = portfolioTable.querySelectorAll('tbody tr');
    let totalValue = 0;

    rows.forEach((row) => {
        const totalValueCell = row.cells[5]; // Assuming the total value is in the 4th cell
        const rowValue = parseFloat(totalValueCell.textContent.replace('$', '').replace(',', '')) || 0; // Get the numeric value

        console.log('Row Value:', rowValue);

        totalValue += rowValue;
    });

    console.log('Total Value:', totalValue);

    if (netWorthDiv) {
        if (rows.length > 0) {
            netWorthDiv.textContent = `Net Worth: $${totalValue.toFixed(2)}`;
        } else {
            netWorthDiv.textContent = 'Add Assets to Calculate Net Worth';
        }
    } else {
        console.error("Net Worth div element not found.");
    }
}




// Call the checkTable() function to initially display the Net Worth
checkTable();

let serialNumber = 1; // Initialize the serial number

// Function to add a new row to the portfolio table
function addAsset(event) {
    console.log('addAsset function called'); // Check if the function is called
    event.preventDefault(); // Prevent the default form submission behavior
	
	const portfolioTable = document.getElementById('portfolio-table');
    const tbody = portfolioTable.querySelector('tbody');
	
	const assetDropdown = document.getElementById('asset');
    const symbolDropdown = document.getElementById('symbol');
    const quantityInput = document.getElementById('quantity');
    const purchasePriceInput = document.getElementById('purchase-price');
    const totalValueInput = document.getElementById('total-value');
	
	// Get the selected asset data
    const selectedAssetName = assetDropdown.options[assetDropdown.selectedIndex].text;
    const selectedAssetSymbol = symbolDropdown.options[symbolDropdown.selectedIndex].text;
    const selectedQuantity = quantityInput.value;
    const selectedPurchasePrice = purchasePriceInput.value;
    const selectedTotalValue = totalValueInput.value;
	
	// Create a new table row and populate it with the selected data
	const newRow = tbody.insertRow();
	const idCell = newRow.insertCell(0);
    const nameCell = newRow.insertCell(1);
    const symbolCell = newRow.insertCell(2);
    const quantityCell = newRow.insertCell(3);
    const priceCell = newRow.insertCell(4);
    const totalValueCell = newRow.insertCell(5);
	
	idCell.textContent = serialNumber;
	nameCell.textContent = selectedAssetName;
    symbolCell.textContent = selectedAssetSymbol;
    quantityCell.textContent = selectedQuantity;
    priceCell.textContent = `$${selectedPurchasePrice}`;
    totalValueCell.textContent = `$${selectedTotalValue}`;

    // Add a "selected" class to the newly added row
    newRow.classList.add('selected');

    // Add an "Edit" and "Remove" button to the new row (similar to the example row)
    const actionCell = newRow.insertCell(6);
    actionCell.innerHTML = '<button onclick="editAsset(this)">Edit</button>' +
                            '<button onclick="removeAsset(this)">Remove</button>';

    
	// Call the checkTable() function after adding assets
	checkTable();
	
	// Increment the serial number for the next row
    serialNumber++;
	
	// Clear form inputs after adding the row
    quantityInput.value = '';
    purchasePriceInput.value = '';
    totalValueInput.value = '';
	
	
	
}

function removeAsset(button) {
    // Navigate to the parent row of the clicked button
    const selectedRow = button.closest('tr');

    if (selectedRow) {
        selectedRow.remove();
    }

    checkTable();
}



// ...

// ...


// Define editedRow at a higher scope
let editedRow;
    

    // Function to open the edit modal/form
async function editAsset(button) {
    // Get the parent row of the button (i.e., the row you want to edit)
    const row = button.parentNode.parentNode;
	
	// Store the edited row
    editedRow = row;
	
	// Show the edit modal/form
    const editModal = document.getElementById('edit-modal');
    editModal.style.display = 'block';

    // Retrieve the asset's data from the selected row
    const name = row.cells[1].textContent;
    const symbol = row.cells[2].textContent;
    const quantity = row.cells[3].textContent;
    const purchasePrice = row.cells[4].textContent;

    // Fill the edit form with the asset's data
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-symbol').value = symbol;
    document.getElementById('edit-quantity').value = quantity;

    // Populate purchase price field
    const editpurchasePriceInput = document.getElementById('edit-purchase-price');
    // Fetch the current purchase price and populate the field
    try {
        const assetResponse = await fetch(`${portfolioUrl}/${name}`, { // Use 'name' as the asset ID
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${portfolioKey}`,
            },
        });
        const editnameData = await assetResponse.json();

        if (editnameData.data) {
            const priceUsd = parseFloat(editnameData.data.priceUsd);
            roundedprice= priceUsd;
			editpurchasePriceInput.value = roundedprice.toFixed(2) ;
						 
        }
    } catch (error) {
        console.error('Error fetching current purchase price:', error);
    }
	
	
	// Add event listeners to quantity and purchase price fields
    const editQuantityInput = document.getElementById('edit-quantity');

    editQuantityInput.addEventListener('input', calculateNewTotalValue);
    editpurchasePriceInput.addEventListener('input', calculateNewTotalValue);
	
	 // Prevent the default form submission behavior
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveEditedAsset(row);
    });
	
	// Add an event listener to close the modal when the user clicks the close button (x)
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        closeEditModal();
    });
}

// Function to calculate new total value
function calculateNewTotalValue() {
    const editpurchasePriceInput = document.getElementById('edit-purchase-price');
    const editQuantityInput = document.getElementById('edit-quantity');
    const editTotalValueInput = document.getElementById('edit-total-value');
    
    const editpurchasePrice = parseFloat(editpurchasePriceInput.value);
    const editQuantity = parseFloat(editQuantityInput.value);
	
    if (!isNaN(editpurchasePrice) && !isNaN(editQuantity)) {
        const editTotalValue = editpurchasePrice * editQuantity;
        editTotalValueInput.value = editTotalValue.toFixed(2); // Format to 2 decimal places
    } else {
        // Clear total value if either input is invalid
        editTotalValueInput.value = '';
    }
}
   

// Function to close the edit modal
function closeEditModal() {
    const editModal = document.getElementById('edit-modal');
    editModal.style.display = 'none';

}




// Function to save edited asset

function saveEditedAsset() {
    // Retrieve the edited data from the form
    const editedName = document.getElementById('edit-name').value;
    const editedSymbol = document.getElementById('edit-symbol').value;
    const editedQuantity = document.getElementById('edit-quantity').value;
    const editedpurchasePriceInput = document.getElementById('edit-purchase-price').value;
    const editedtotalValueInput = document.getElementById('edit-total-value').value;

    // Ensure that you have the correct row passed as a parameter
    if (editedRow) {
        // Update the edited row in the table
        editedRow.cells[1].textContent = editedName;
        editedRow.cells[2].textContent = editedSymbol;
        editedRow.cells[3].textContent = editedQuantity;
        editedRow.cells[4].textContent = editedpurchasePriceInput;
        editedRow.cells[5].textContent = editedtotalValueInput;

        // Hide the edit modal/form
        closeEditModal();
    }
	
	checkTable();
}





