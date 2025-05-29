const productList = document.getElementById("product-list");
const addProductForm = document.getElementById("add-product-form");
const messageArea = document.getElementById("message-area");
const resetAllBtn = document.getElementById("reset-all-btn");
const loadingMessage = document.getElementById("loading-message");

const LOCAL_STORAGE_KEY = "myProductsData";

let products = [];
function displayMessage(message, type) {
  console.log(`Displaying message: "${message}" of type: "${type}"`);

  messageArea.textContent = message;

  messageArea.classList.remove("hidden", "success", "error");

  if (type === "success") {
    messageArea.classList.add("success");
  } else if (type === "error") {
    messageArea.classList.add("error");
  }

  // setTimeout(function () {
  // messageArea.classList.add("hidden");
  // }, 3000); //
}

function renderProducts() {
  productList.innerHTML = "";

  loadingMessage.classList.add("hidden");

  if (products.length === 0) {
    productList.innerHTML =
      '<p class="no-products-message">No products found</p>';
    return; // Stop the function here, no products to render.
  }

  // Loop through each 'product' item in our 'products' array.
  // This is a simple 'for' loop, which is very common in JavaScript.
  for (let i = 0; i < products.length; i++) {
    const product = products[i]; // Get the current product from the array

    // Create a new HTML 'div' element for this product card.
    const productCard = document.createElement("div");
    productCard.className = "product-card"; // Add the CSS class for styling

    // Store the product's unique ID on the card itself.
    // This is useful later when we want to delete a specific product.
    productCard.setAttribute("data-id", product.id);

    // Prepare the image URL. If the product doesn't have an image, use a placeholder.
    const imageUrl =
      product.image ||
      "https://placehold.co/400x300/e0e0e0/000000?text=No+Image";

    // Build the HTML content for this product card.
    // We use backticks (``) for a "template literal" which allows us to embed variables easily.
    productCard.innerHTML = `
            <img src="${imageUrl}" alt="${product.title || "Product Image"}"
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/e0e0e0/000000?text=Image+Error';"
                 class="product-image">
            <div class="product-card-content">
                <h3>${product.title}</h3>
                <p>${product.description.substring(
                  0,
                  100
                )}...</p> <p class="price">$${
      product.price ? product.price.toFixed(2) : "N/A"
    }</p>
                ${
                  product.brand
                    ? `<p class="brand">Brand: ${product.brand}</p>`
                    : ""
                } <button class="delete-btn button danger-button"
                        data-id="${product.id}"> Delete
                </button>
            </div>
        `;

    // Add this newly created product card to our main product list on the web page.
    productList.appendChild(productCard);
  }
}

// --- 6. Function: Load Products from Browser's Local Storage ---
// This function tries to get our product list from the browser's memory (local storage).
function loadProductsFromStorage() {
  // localStorage.getItem(KEY) tries to retrieve data saved under that key.
  const storedProductsText = localStorage.getItem(LOCAL_STORAGE_KEY);
  // If we found data, it will be a text string. We need to convert it back to a JavaScript array.
  // JSON.parse() does this conversion.
  if (storedProductsText) {
    return JSON.parse(storedProductsText);
  } else {
    return null; // If no data found, return null.
  }
}

// --- 7. Function: Save Products to Browser's Local Storage ---
// This function saves our current `products` array to the browser's local storage.
function saveProductsToStorage() {
  // localStorage can only store text. So, we convert our JavaScript array to a JSON text string.
  // JSON.stringify() does this conversion.
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
}

// --- 8. Function: Fetch Products from a Mock API (Online Data) ---
// This function gets product data from an external website (a "mock API").
// We use 'async' and 'await' to handle operations that take time, like fetching data over the internet.
// 'async' means this function will run in the background. 'await' means "pause here until this operation is finished."
async function fetchProductsFromAPI() {
  loadingMessage.classList.remove("hidden"); // Show "Loading..." message

  try {
    // Use 'fetch()' to make a request to the API URL.
    const response = await fetch("https://fakestoreapi.com/products");

    // Check if the request was successful (status code 200 means OK).
    if (!response.ok) {
      // If not successful, throw an error.
      throw new Error("Network response was not ok: " + response.status);
    }

    // Convert the response from the API into a JavaScript array (JSON format).
    const apiProducts = await response.json();

    // Create a new array to hold our products.
    let formattedProducts = [];
    // Loop through each product we got from the API.
    for (let i = 0; i < apiProducts.length; i++) {
      const p = apiProducts[i];
      // Create a new product object with the format we want.
      // We add a 'brand' (from category) and ensure a unique 'id'.
      formattedProducts.push({
        id: p.id || Date.now() + Math.random(), // Use existing ID or create a unique one
        title: p.title,
        description: p.description,
        image: p.image,
        price: p.price,
        // Make brand from category, capitalize first letter
        brand: p.category
          ? p.category.charAt(0).toUpperCase() + p.category.slice(1)
          : "Generic",
      });
    }
    return formattedProducts; // Return the list of products
  } catch (error) {
    // If anything goes wrong during the fetch (e.g., no internet), catch the error.
    console.error("Error fetching products:", error); // Log the error to the console
    displayMessage(
      "Failed to load products from API. Please check your internet connection.",
      "error"
    );
    return []; // Return an empty list if there was an error.
  } finally {
    loadingMessage.classList.add("hidden"); // Always hide the loading message when done.
  }
}

// --- 9. Event Listener: When the "Add Product" Form is Submitted ---
// This listens for when someone clicks the "Add Product" button in the form.
addProductForm.addEventListener("submit", function (event) {
  event.preventDefault(); // IMPORTANT: This stops the browser from reloading the page!

  // Get the values that the user typed into each form field.
  const nameInput = document.getElementById("product-name");
  const descriptionInput = document.getElementById("product-description");
  const imageUrlInput = document.getElementById("product-image-url");
  const priceInput = document.getElementById("product-price");
  const brandInput = document.getElementById("product-brand");

  const name = nameInput.value.trim(); // .trim() removes extra spaces
  const description = descriptionInput.value.trim();
  const imageUrl = imageUrlInput.value.trim();
  const price = parseFloat(priceInput.value); // Convert price text into a number
  const brand = brandInput.value.trim();

  // --- Input Validation (Checking if inputs are valid) ---
  // If any required field is empty, or price is not a number, show an error.
  if (!name || !description || !imageUrl || isNaN(price) || price <= 0) {
    displayMessage(
      "Please fill in all required fields and ensure price is a valid positive number.",
      "error"
    );
    return; // Stop the function here if validation fails.
  }

  // --- Create a New Product Object ---
  // Make a new JavaScript object (like a mini-database entry) for the new product.
  const newProduct = {
    id: Date.now(), // Give it a unique ID using the current time (very simple way to get unique ID)
    title: name,
    description: description,
    image: imageUrl,
    price: price,
    brand: brand || "Unknown", // If brand is empty, set it to 'Unknown'
  };

  // --- Add to Our Products List and Save ---
  products.push(newProduct); // Add the new product object to our global 'products' array
  saveProductsToStorage(); // Save this updated list to the browser's local storage

  // --- Update the Web Page ---
  renderProducts(); // Re-display all products, now including the new one

  displayMessage("Product added successfully!", "success"); // Show success message

  // --- Clear the Form ---
  // Reset all form fields back to empty after adding the product.
  addProductForm.reset();
});

// --- 10. Event Listener: When the Product List is Clicked (for Delete Buttons) ---
// We attach ONE listener to the main product list container.
// This is called "Event Delegation" and it's efficient for dynamically added items.
// Instead of adding a listener to EVERY delete button (which we can't do if they are added later),
// we listen on their parent. When a click happens, we check if the clicked item was a delete button.
productList.addEventListener("click", function (event) {
  // Check if the element that was clicked has the CSS class 'delete-btn'.
  if (event.target.classList.contains("delete-btn")) {
    // Get the unique ID of the product from the button's 'data-id' attribute.
    const productIdToDelete = parseInt(event.target.dataset.id);

    // --- Remove from the Web Page (DOM) ---
    // Find the closest parent HTML element that has the class 'product-card'.
    const productCardToRemove = event.target.closest(".product-card");
    if (productCardToRemove) {
      productCardToRemove.remove(); // Remove that whole product card from the page!
    }

    // --- Update Our Products List and Save ---
    // Create a NEW array that contains all products EXCEPT the one we want to delete.
    // We use .filter() which is a simple way to create a new array based on a condition.
    products = products.filter(function (product) {
      return product.id !== productIdToDelete; // Keep product if its ID does NOT match the one to delete
    });
    saveProductsToStorage(); // Save this updated (shorter) list to local storage

    displayMessage("Product deleted successfully!", "success"); // Show success message

    // If, after deleting, the list becomes empty, re-render to show the "No products" message.
    if (products.length === 0) {
      renderProducts();
    }
  }
});

// --- 11. Event Listener: When the "Reset All" Button is Clicked ---
// This listens for when someone clicks the "Reset All Products" button.
resetAllBtn.addEventListener("click", function () {
  // Clear our global `products` array completely.
  products = [];
  // Also remove the product data from local storage.
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  // Re-display the product list (which will now be empty).
  renderProducts();
  displayMessage("All products have been reset!", "success"); // Show success message
});

// --- 12. Initial Load: What Happens When the Page First Opens ---
// This code runs automatically once the entire HTML page is loaded in the browser.
document.addEventListener("DOMContentLoaded", async function () {
  // Step 1: Try to load products that were saved in the browser's local storage.
  const storedProducts = loadProductsFromStorage();

  if (storedProducts && storedProducts.length > 0) {
    // If we found saved products, use them!
    products = storedProducts;
    renderProducts(); // Display these saved products on the page.
    displayMessage("Products loaded from local storage.", "success");
  } else {
    // If no products were saved in local storage, then fetch them from the online API.
    products = await fetchProductsFromAPI(); // Wait for the API call to finish

    if (products.length > 0) {
      // If we successfully got products from the API, save them for next time.
      saveProductsToStorage();
      renderProducts(); // Display the products from the API.
      displayMessage("Products loaded from API.", "success");
    } else {
      // If neither local storage nor API provided products, show a message.
      productList.innerHTML =
        '<p class="loading-message">Could not load any products. Please try again later.</p>';
    }
  }
});
