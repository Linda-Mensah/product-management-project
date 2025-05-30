const container = document.getElementById("productsContainer");
const baseUrl = "https://fakestoreapi.com/products";

const fetchProducts = async () => {
  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.log("Error fetching products:", error);
  }
};

const displayData = (data) => {
  data.forEach((item) => {
    let productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <img src="${item.image}" alt="${item.title}"/>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <button>Delete</button>
    `;
    container.appendChild(productCard);
  });
};

fetchProducts();
