// RENDERS
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
    (acc, current) => +acc + +current.price * +current.quantity,
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

// ROOT FUNCTION
const getProductsAndFillCards = async () => {
  showLoader();

  const products = await getData(`${BASE_URL}/products`);
  const ordersData = await getData(`${BASE_URL}/orders`);

  renderProducts(products);

  renderOrders(ordersData);
  hideLoader();
};

// EVENT LISTENERS
CONFIRM_ORDER_BUTTON.addEventListener("click", createOrder);

LOGOUT_BUTTON.addEventListener("click", () => {
  localStorage.removeItem("TOKEN");
  window.location.reload();
});

window.onload = async () => {
  await getProductsAndFillCards();
  renderCart();
};
