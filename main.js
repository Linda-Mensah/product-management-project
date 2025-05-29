// referencing the elements

const form = document.getElementById("productForm");
const messageBox = document.getElementById("message");
const productsContainer = document.getElementById("productsContainer");
const displaySection = document.getElementById("displaySection");

let hasDisplayedTitle = false;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").value.trim();
  const price = document.getElementById("price").value.trim();
  const brand = document.getElementById("brand").value.trim();

  // read more on the logical not operator used this way
  if (!name || !description || !image || !price || !brand) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  showMessage("Product added successfully!", "success");

  // idea: hide the heading and only show it when display-section details are populated
  if (!hasDisplayedTitle) {
    const heading = document.createElement("h2");
    heading.textContent = "Products";
    displaySection.prepend(heading);
    hasDisplayedTitle = true;
  }

  // for creating the product card
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <h3>${name}</h3>
    <p>${description}</p>
    <img src="${image}" alt="${name}" />
    <p><span>$${parseFloat(price).toFixed(2)}</span></p>
    <p>${brand}</p>
  `;

  productsContainer.appendChild(card);
  form.reset();
});

// Utility: show message
function showMessage(text, type) {
  messageBox.textContent = text;

  // let's use a ternary operators/conditional operator here. makes it more concise. need to revise though
  messageBox.className = type === "success" ? "success" : "error";
  messageBox.classList.add(type);
  messageBox.style.display = "block";
}
