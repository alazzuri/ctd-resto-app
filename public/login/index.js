const BASE_URL = "http://localhost:5000/v1";
// const BASE_URL = "https://ctd-api-resto.herokuapp.com/v1";

const LOGIN_BUTTON = document.querySelector("#loginBtn");
const CREATE_ACCOUNT_BUTTON = document.querySelector("#createAccountBtn");

const checkTokenAndRedirect = () => {
  const token = localStorage.getItem("TOKEN");

  if (!token) return;

  const { role } = token;

  if (role === "admin") {
    window.location.assign("/admin/dashboard");
  } else {
    window.location.assign("/user/home");
  }
};

const onHandleLogin = async (e) => {
  e.preventDefault();

  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) throw new Error(json);

    const { jwt, role } = json;

    localStorage.setItem("TOKEN", jwt);

    if (role === "admin") {
      window.location.assign("/admin/dashboard");
    } else {
      window.location.assign("/user/home");
    }
  } catch (error) {
    // Agregar mensajes de error
    console.log(error);
  }
};

const onHandleCreateAccount = (e) => {
  e.preventDefault();
  window.location.assign("/register");
};

window.addEventListener("load", checkTokenAndRedirect);

LOGIN_BUTTON.addEventListener("click", async (e) => {
  await onHandleLogin(e);
});

CREATE_ACCOUNT_BUTTON.addEventListener("click", (e) => {
  LOGIN_BUTTON.removeEventListener("click", onHandleLogin);
  CREATE_ACCOUNT_BUTTON.removeEventListener("click", onHandleCreateAccount);
  onHandleCreateAccount(e);
});
