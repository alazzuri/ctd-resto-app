// RENDERS
const renderProducts = (productsData) => {
  const detailsContainer = document.querySelector("#productsDetail");

  productsData.sort((current, next) => current.id > next.id);

  productsData.forEach((product) => {
    const tr = document.createElement("tr");
    const productData = JSON.stringify(product);

    tr.innerHTML = `
      <th scope="row">${product.id}</th>
      <td><img src="${product.photo}" id="productPhoto" alt="${product.name}"/></td>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>
      <button type="button" class="btn btn-secondary btn-sm editProduct" 
      data-product="${product.id};${product.name};${product.price};${product.photo}"
      >
        Editar
      </button>
      <button type="button" class="btn btn-danger btn-sm mx-2 deleteProduct" data-id="${product.id}">Eliminar</button>
      </td>
      `;

    detailsContainer.appendChild(tr);
  });

  const deleteButtons = document.querySelectorAll(".deleteProduct");
  const editButtons = document.querySelectorAll(".editProduct");

  editButtons.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { product } = e.target.dataset;
        const [id, name, price, photo] = product.split(";");
        const nameInput = document.querySelector("#inputProductName");
        const photoInput = document.querySelector("#inputImage");
        const priceInput = document.querySelector("#inputPrice");

        nameInput.value = name;
        priceInput.value = price;
        photoInput.value = photo;

        const productForm = document.querySelector("aside");

        productForm.classList.remove("hidden");
        CREATE_PRODUCT_BUTTON.classList.add("hidden");
        SAVE_PRODUCT.setAttribute("data-isEdit", true);
        SAVE_PRODUCT.setAttribute("data-productId", id);
      })
  );

  deleteButtons.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { id } = e.target.dataset;

        const response = await deleteData(`${BASE_URL}/products`, id);
        if (response) return window.location.reload();
      })
  );
};

const renderUsers = (usersData) => {
  const detailsContainer = document.querySelector("#usersDetail");

  usersData.sort((current, next) => current.id > next.id);

  usersData.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <th scope="row">${user.id}</th>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.role === "admin" ? "Administrador" : "Cliente"}</td>

        `;

    detailsContainer.appendChild(tr);
  });
};

const renderOrders = (ordersData) => {
  const detailsContainer = document.querySelector("#ordersDetail");

  ordersData.sort((current, next) => current.id > next.id);

  ordersData.forEach((order) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
          <th scope="row">${order.id}</th>
          <td class="table-${getColorByStatus(order.status)}">${getStatusName(
      order.status
    )}</td>
          <td>$${order.amount}</td>
          <td>${order.description}</td>
          <td>${
            order.paymentMethod === "cash"
              ? "Efectivo"
              : "Tarjeta de crédito/débito"
          }</td>
          <td>
          <button type="button"  class="btn btn-secondary btn-sm editOrder" data-id="${
            order.id
          }"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        >Cambiar Estado</button>
          <button type="button" class="btn btn-danger btn-sm mx-2 deleteOrder" data-id="${
            order.id
          }">Eliminar</button>
          </td>
          `;

    detailsContainer.appendChild(tr);
  });

  const deleteButtons = document.querySelectorAll(".deleteOrder");
  const editButtons = document.querySelectorAll(".editOrder");
  const updateButton = document.querySelector("#updateStatusBtn");

  editButtons.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { id } = e.target.dataset;

        const modalTitle = document.querySelector("#orderNumber");
        modalTitle.textContent = id;
      })
  );

  deleteButtons.forEach(
    (button) =>
      (button.onclick = async (e) => {
        const { id } = e.target.dataset;

        const response = await deleteData(`${BASE_URL}/orders`, id);
        if (response) return window.location.reload();
      })
  );

  updateButton.onclick = async () => {
    const id = document.querySelector("#orderNumber").textContent;
    const status = document.querySelector("#orderStatus").value;

    const response = await updateData(`${BASE_URL}/orders`, id, { status });
    if (response) return window.location.reload();
  };
};

// ROOT FUNCTION
const getDataAndFillTables = async () => {
  const productsData = await getData(`${BASE_URL}/products`);
  const ordersData = await getData(`${BASE_URL}/orders`);
  const usersData = await getData(`${BASE_URL}/private/users`);

  renderProducts(productsData);
  renderUsers(usersData);
  renderOrders(ordersData);
};

// EVENT LISTENERS
SAVE_PRODUCT.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = document.querySelector("#inputProductName").value;
  const photo = document.querySelector("#inputImage").value;
  const price = document.querySelector("#inputPrice").value;
  const isEdit = e.target.dataset.isedit === "true";
  const productId = +e.target.dataset.productid;

  const token = localStorage.getItem("TOKEN");

  if (!token) return window.location.assign("/");

  if (isEdit && productId) {
    try {
      const response = await updateData(`${BASE_URL}/products`, productId, {
        name,
        photo,
        price,
      });

      if (response) return window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ name, photo, price }),
    });

    const json = await response.json();

    if (!response.ok) throw new Error(json);

    window.location.reload();
  } catch (err) {
    console.log(err);
  }
});

CANCEL_SAVE_PRODUCT.addEventListener("click", () => {
  const productForm = document.querySelector("aside");

  productForm.classList.add("hidden");
  CREATE_PRODUCT_BUTTON.classList.remove("hidden");
});

CREATE_PRODUCT_BUTTON.addEventListener("click", () => {
  const productForm = document.querySelector("aside");
  const name = document.querySelector("#inputProductName");
  const photo = document.querySelector("#inputImage");
  const price = document.querySelector("#inputPrice");

  name.value = "";
  price.value = "";
  photo.value = "";

  SAVE_PRODUCT.setAttribute("data-isEdit", false);

  productForm.classList.remove("hidden");
  CREATE_PRODUCT_BUTTON.classList.add("hidden");
});

LOGOUT_BUTTON.addEventListener("click", () => {
  localStorage.removeItem("TOKEN");
  window.location.reload();
});

window.onload = async () => await getDataAndFillTables();
