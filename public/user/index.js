const BASE_URL = "http://localhost:5000/v1";
// const BASE_URL = "https://ctd-api-resto.herokuapp.com/v1";
const CONFIRM_ORDER_BUTTON = document.querySelector("#confirmOrder");
const LOGOUT_BUTTON = document.querySelector("#logout");

const getColorByStatus = (status) => {
  switch (status) {
    case "new":
      return "danger";
    case "confirmed":
      return "primary";
    case "preparing":
      return "info";
    case "delivering":
      return "warning";
    case "delivered":
      return "success";

    default:
      "danger";
      break;
  }
};

const getStatusName = (status) => {
  switch (status) {
    case "new":
      return "Nueva";
    case "confirmed":
      return "Confirmada";
    case "preparing":
      return "En preparación";
    case "delivering":
      return "En camino";
    case "delivered":
      return "Entregada";

    default:
      "Nueva";
      break;
  }
};

const getData = async (endpoint) => {
  const token = localStorage.getItem("TOKEN");

  if (!token) return window.location.assign("/");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  try {
    const response = await fetch(endpoint, { headers: myHeaders });
    const json = await response.json();

    if (!response.ok) throw new Error(json);

    return json;
  } catch (error) {
    console.log(error);
  }
};

const addProductToCart = (product) => {
  const currentCart = JSON.parse(localStorage.getItem("PRODUCTS_CART"));

  if (!currentCart)
    return localStorage.setItem(
      "PRODUCTS_CART",
      JSON.stringify([{ ...product, quantity: 1 }])
    );

  const isExistingProduct = currentCart.find((item) => item.id === product.id);
  let updatedCart;

  if (!isExistingProduct) {
    updatedCart = [...currentCart, { ...product, quantity: 1 }];
  } else {
    updatedCart = currentCart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }
  localStorage.setItem("PRODUCTS_CART", JSON.stringify(updatedCart));
  return renderCart();
};

const removeProductFromCart = (productId) => {
  const currentCart = JSON.parse(localStorage.getItem("PRODUCTS_CART"));

  if (!currentCart) return;

  const updatedCart = currentCart.filter((item) => item.id !== productId);

  return localStorage.setItem("PRODUCTS_CART", JSON.stringify(updatedCart));
};

const clearCart = () => localStorage.removeItem("PRODUCTS_CART");

const renderCart = () => {
  const productsData = JSON.parse(localStorage.getItem("PRODUCTS_CART"));
  const detailsContainer = document.querySelector("#productsDetail");
  const amountDetail = document.querySelector("#orderAmount");

  detailsContainer.innerHTML = "";

  if (!productsData) return;

  productsData.sort((current, next) => current.id > next.id);

  productsData.forEach((product) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td><img src="${product.photo}" id="productPhoto" alt="${product.name}"/></td>
        <td>${product.name}</td>
        <td>$${product.price}</td>
        <td>${product.quantity}</td>
        <td>
        <button type="button" class="btn btn-danger btn-sm mx-2 deleteProduct" data-id="${product.id}">Eliminar</button>
        </td>
        `;

    detailsContainer.appendChild(tr);
  });

  const deleteButtons = document.querySelectorAll(".deleteProduct");

  deleteButtons.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { id } = e.target.dataset;

        removeProductFromCart(id);
        return window.location.reload();
      })
  );

  const orderTotal = productsData.reduce(
    (acc, current) => +acc + +current.price,
    0
  );

  amountDetail.textContent = orderTotal;
};

const renderProducts = (productsData) => {
  let container = document.querySelector("#productsGrid");

  productsData.map((product) => {
    const productCard = `
      <div class="card m-4 p-0 d-flex flex-column justify-content-between" style="width: 18rem">
      <img src="${product.photo}" class="card-img-top h-50" alt="${product.name}"/>
      <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">
      $${product.price}
      </p>
      <button 
      class="btn btn-primary addToCartButton"
      data-product="${product.id};${product.name};${product.price};${product.photo}"
      >
        Agregar al carrito
      </button>
      </div>
      </div>
      `;

    container.innerHTML += productCard;
  });

  const addToCartButton = document.querySelectorAll(".addToCartButton");

  addToCartButton.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { product } = e.target.dataset;
        const [id, name, price, photo] = product.split(";");

        return addProductToCart({ id, name, price, photo });
      })
  );
};
const renderOrders = (ordersData) => {
  const detailsContainer = document.querySelector("#ordersDetail");

  ordersData.sort((current, next) => current.id > next.id);

  ordersData.forEach((order) => {
    const tr = document.createElement("tr");
    const spacer = document.createElement("tr");
    spacer.classList.add("spacer");

    tr.innerHTML = `
            <td class="table-${getColorByStatus(
              order.status
            )}" id="orderStatusDetail">${getStatusName(order.status)}</td>
            <td>$${order.amount}</td>
            <td>${order.description}</td>
            <td>${
              order.paymentMethod === "cash"
                ? "Efectivo"
                : "Tarjeta de crédito/débito"
            }</td>
            `;

    detailsContainer.appendChild(spacer);
    detailsContainer.appendChild(tr);
  });
};

const createOrder = async () => {
  const productsData = JSON.parse(localStorage.getItem("PRODUCTS_CART"));
  const token = localStorage.getItem("TOKEN");

  if (!token) return window.location.assign("/");

  const paymentMethod = document.querySelector("#paymentMethod").value;
  console.log(paymentMethod);

  const normalizedProductsData = productsData.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
  }));

  const description = productsData.reduce((acc, current) => {
    const productDescription = current.name;
    const productQuantity = current.quantity;

    const parsedDescription = `${productQuantity}x${productDescription.slice(
      0,
      5
    )} `;

    return (acc += parsedDescription);
  }, "");

  const orderData = {
    description,
    products: normalizedProductsData,
    paymentMethod,
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(orderData),
    });

    const json = await response.json();

    if (!response.ok) throw new Error(json);

    clearCart();
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

const getProductsAndFillCards = async () => {
  const products = await getData(`${BASE_URL}/products`);
  const ordersData = await getData(`${BASE_URL}/orders`);

  renderProducts(products);

  renderOrders(ordersData);
};

CONFIRM_ORDER_BUTTON.addEventListener("click", createOrder);

LOGOUT_BUTTON.addEventListener("click", () => {
  localStorage.removeItem("TOKEN");
  window.location.reload();
});

window.onload = async () => {
  await getProductsAndFillCards();
  renderCart();
};
