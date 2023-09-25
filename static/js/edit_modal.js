// Populate purchase price field
const editpurchasePriceInput = document.getElementById('edit-purchase-price');
// Fetch the current purchase price and populate the field
    try {
        const assetResponse = await fetch(`${portfolioUrl}/${edit-name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${portfolioKey}`,
            },
        });
        const edit-nameData = await edit-nameResponse.json();

        if (edit-nameData.data) {
            const priceUsd = edit-nameData.data.priceUsd;
            editpurchasePriceInput.value = priceUsd;
        }
    } catch (error) {
        console.error('Error fetching current purchase price:', error);
    }

// Function to calculate new total value
function calculateNewTotalValue() {
    const editpurchasePriceInput = document.getElementById('edit-purchase-price');
    const editquantityInput = document.getElementById('edit-quantity');
    const edittotalValueInput = document.getElementById('edit-total-value');

    const editpurchasePrice = parseFloat(editpurchasePriceInput.value);
    const editquantity = parseFloat(editquantityInput.value);
	const edittotalValue = editpurchasePrice * editquantity;
    totalValueInput.value = totalValue.toFixed(2); // Format to 2 decimal places
}

// Add event listeners to calculate new total value when editpurchase price or editquantity changes
const editpurchasePriceInput = document.getElementById('edit-purchase-price');
const editquantityInput = document.getElementById('edit-quantity');

editpurchasePriceInput.addEventListener('input', calculateNewTotalValue);
editquantityInput.addEventListener('input', calculateNewTotalValue);
