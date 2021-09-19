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
