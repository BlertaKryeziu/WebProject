
document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    renderProducts("All");

    async function fetchCategories() {
    try {
        const response = await fetch("https://dummyjson.com/products/categories");
        const categories = await response.json();
        return ["All", ...categories.map((category) => category.name)];
    } catch (error) {
        return ["All"];
    }
}

async function renderCategories() {
    const categories = await fetchCategories();
    const categoryContainer = document.querySelector(".buttons");
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";
    
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("category");
        if (category === "All") button.classList.add("active");
        button.textContent = category;

        button.addEventListener("click", () => {
            document.querySelectorAll(".category").forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            renderProducts(category);
        });

        categoryContainer.appendChild(button);
    });
}

async function fetchProducts(category) {
    try {
        const url = category !== "All"
            ? `https://dummyjson.com/products/category/${category}`
            : "https://dummyjson.com/products";
        const response = await fetch(url);
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        return [];
    }
}

async function renderProducts(category) {
    const products = await fetchProducts(category);
    const productContainer = document.querySelector(".products");
    if (!productContainer) return;
    productContainer.innerHTML = products.length ? "" : "<h1>This category is empty!</h1>";

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `

            <img src="${product.thumbnail}" class="photo" height="300px">
            <div class="product-header">${product.title}</div>
            <div class="product-description">${product.description}</div>
            <ul class="shopp">
                <li class="price">${product.price}$</li>
                <li><button class="add">Add to Cart</button></li>
                <li class="like"><i class="fa-solid fa-heart"></i></li>
            </ul>
        `;
        productContainer.appendChild(productElement);
    });

    setupAddToCartButtons();
}

function setupAddToCartButtons() {
    document.querySelectorAll(".add").forEach((button) => {
        button.addEventListener("click", (event) => {
            const productElement = event.target.closest(".product");
            const product = {
                name: productElement.querySelector(".product-header").textContent.trim(),
                price: productElement.querySelector(".price").textContent.trim(),
                description: productElement.querySelector(".product-description").textContent.trim(),
                image: productElement.querySelector(".photo").src,
                quantity: 1
            };
            addToCart(product);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();

    Toastify({
        text: `${product.name} added to the cart!`,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#ff7a00",
        stopOnFocus: true,
    }).showToast();
}

function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");
    if (!cartBadge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartBadge.textContent = cart.reduce((total, product) => total + (product.quantity || 1), 0);
}


    setTimeout(() => {
        const cartBadge = document.getElementById("cart-badge");
        if (cartBadge) {
            updateCartBadge();
        }
    }, 300);
});