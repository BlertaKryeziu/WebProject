document.addEventListener("DOMContentLoaded", () => {
  renderShoppingCart();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderShoppingCart() {
  const cart = getCart();
  const itemsContainer = document.querySelector(".items");
  const cartText = document.querySelector(".text");

  if (!itemsContainer || !cartText) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<h1>Your cart is empty.</h1>";
    cartText.textContent = "You have 0 items in your cart";
    return;
  }

  cartText.textContent = `You have ${cart.length} items in your cart`;
  itemsContainer.innerHTML = "";

  cart.forEach((product, index) => {
    let price = parseFloat(product.price) || 0;
    let quantity = parseInt(product.quantity) || 1;
    let totalPrice = (price * quantity).toFixed(2);

    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `
            <ul class="new-item">
                <li><img src="${product.image}" class="image"></li>
                <li class="info"><p>${product.name}</p></li>
                <li class="icons">
                    <span class="quantity" data-index="${index}">${quantity}</span>
                    <span class="increase" data-index="${index}"><i class="fa-solid fa-caret-up"></i></span>
                    <span class="decrease" data-index="${index}"><i class="fa-solid fa-caret-down"></i></span>
                </li>
                <li class="icons"><span class="price" data-index="${index}">$${totalPrice}</span></li>
                <li class="icons">
                    <span class="delete" data-index="${index}"><i class="fa-regular fa-trash-can"></i></span>
                </li>
            </ul>
        `;

    itemsContainer.appendChild(itemElement);
  });

  document
    .querySelectorAll(".increase")
    .forEach((btn) => btn.addEventListener("click", increaseQuantity));
  document
    .querySelectorAll(".decrease")
    .forEach((btn) => btn.addEventListener("click", decreaseQuantity));
  document
    .querySelectorAll(".delete")
    .forEach((btn) => btn.addEventListener("click", removeItem));

  calculateTotal();
}

function increaseQuantity(event) {
  const cart = getCart();
  const index = event.target.closest(".increase").dataset.index;
  cart[index].quantity++;
  updateCart(cart);
}

function decreaseQuantity(event) {
  const cart = getCart();
  const index = event.target.closest(".decrease").dataset.index;
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCart(cart);
}

function removeItem(event) {
  const cart = getCart();
  const index = event.target.closest(".delete").dataset.index;
  cart.splice(index, 1);
  updateCart(cart);
}

function updateCart(cart) {
  saveCart(cart);
  renderShoppingCart();
}

function calculateTotal() {
  let cart = getCart();
  let subtotal = cart.reduce(
    (sum, product) => sum + parseFloat(product.price) * (product.quantity || 1),
    0
  );
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `$${(subtotal + 4).toFixed(2)}`;
}

/*  Validimi i formes */
const payButton = document.getElementById("pay-button");
if (payButton) {
  payButton.addEventListener("click", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name-on-card");
    const numberInput = document.getElementById("card-number");
    const dateInput = document.getElementById("expiration-date");
    const cvvInput = document.getElementById("cvv");
    const errorText = document.getElementById("textt");
    const successModal = document.getElementById("success-modal");

    if (
      !nameInput ||
      !numberInput ||
      !dateInput ||
      !cvvInput ||
      !errorText ||
      !successModal
    ) {
      console.log("Te plotesohet e gjitha!");
      return;
    }

    const name = nameInput.value.trim();
    const number = numberInput.value.replace(/\s+/g, "");
    const date = dateInput.value.trim();
    const cvv = cvvInput.value.trim();

    let valid = true;

    if (!/^[a-zA-Z\s]+$/.test(name) || name === "") {
      errorText.style.display = "block";
      nameInput.style.border = "2px solid red";
      valid = false;
    } else {
      errorText.style.display = "none";
      nameInput.style.border = "";
    }

    if (!/^[0-9]{16}$/.test(number)) {
      alert("Please enter a valid 16-digit card number.");
      valid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) {
      alert("Please enter a valid expiration date (MM/YY).");
      valid = false;
    }

    if (!/^[0-9]{3}$/.test(cvv)) {
      alert("Please enter a valid 3-digit CVV.");
      valid = false;
    }

    if (!valid) return;

    nameInput.value = "";
    numberInput.value = "";
    dateInput.value = "";
    cvvInput.value = "";

    successModal.style.display = "flex";

    setTimeout(() => {
      successModal.style.display = "none";
      localStorage.removeItem("cart");
      renderShoppingCart();
      document.getElementById("subtotal").innerText = "$0.00";
      document.getElementById("total").innerText = "$0.00";
    }, 2000);
  });
}


const cardNumberInput = document.getElementById("card-number");
if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (event) {
        let input = event.target.value.replace(/\D/g, "").substring(0, 16);
        event.target.value = input.match(/.{1,4}/g)?.join(" ") || input;
    });
}

const expirationDateInput = document.getElementById("expiration-date");
if (expirationDateInput) {
    expirationDateInput.addEventListener("input", function (event) {
        let input = event.target.value.replace(/\D/g, "").substring(0, 4);
        event.target.value = input.length >= 3 ? `${input.substring(0, 2)}/${input.substring(2)}` : input;
    });
}
