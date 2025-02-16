document.addEventListener("DOMContentLoaded", () => {
    let cart = [];
    let products = [];
  
    // DOM Elements
    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const clearCartButton = document.getElementById("clear-cart");
  
    // Fetch products from JSON file
    async function fetchProducts() {
      try {
        const response = await fetch("products.json");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    }
  
    // Render Products
    function renderProducts(products) {
      productList.innerHTML = products
        .map(
          (product) => `
        <div class="product" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `
        )
        .join("");
    }
  
    // Add to Cart
    window.addToCart = function(productId) {
      const product = products.find((p) => p.id === productId);
      const cartItem = cart.find((item) => item.id === productId);
  
      if (cartItem) {
        cartItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
  
      updateCart();
    }
  
    // Update Cart
    function updateCart() {
      renderCartItems();
      updateCartTotal();
      updateCartCount();
    }
  
    // Render Cart Items
    function renderCartItems() {
      cartItems.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <span>${item.name} (x${item.quantity})</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
          <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
      `
        )
        .join("");
    }
  
    // Update Quantity
    function updateQuantity(productId, newQuantity) {
      if (newQuantity <= 0) {
        cart = cart.filter((item) => item.id !== productId);
      } else {
        const cartItem = cart.find((item) => item.id === productId);
        if (cartItem) cartItem.quantity = newQuantity;
      }
  
      updateCart();
    }
  
    // Update Cart Total
    function updateCartTotal() {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }
  
    // Update Cart Count
    function updateCartCount() {
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = `Cart: ${count}`;
    }
  
    // Clear Cart
    clearCartButton.addEventListener("click", () => {
      cart = [];
      updateCart();
    });
  
    // Initialize
    fetchProducts().then((data) => {
      products = data;
      renderProducts(products);
    });
  });
  