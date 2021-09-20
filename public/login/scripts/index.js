const checkTokenAndRedirect = () => {
  const token = localStorage.getItem("TOKEN");

  if (!token) return;

  const { role } = token;

  showLoader();
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

  showLoader();

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
    hideLoader();
  }
};

const onHandleCreateAccount = (e) => {
  e.preventDefault();
  window.location.assign("/register");
};

//EVENT LISTENERS
window.addEventListener("load", checkTokenAndRedirect);

LOGIN_BUTTON.addEventListener("click", async (e) => {
  await onHandleLogin(e);
});

CREATE_ACCOUNT_BUTTON.addEventListener("click", (e) => {
  LOGIN_BUTTON.removeEventListener("click", onHandleLogin);
  CREATE_ACCOUNT_BUTTON.removeEventListener("click", onHandleCreateAccount);
  onHandleCreateAccount(e);
});
