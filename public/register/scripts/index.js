const onHandleLogin = async (e) => {
  e.preventDefault();

  const firstName = document.querySelector("#inputFirstname").value;
  const lastName = document.querySelector("#inputFirstname").value;
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;
  const radioInputs = [...document.querySelectorAll(".form-check-input")];
  const selectedRole = radioInputs.find((input) => input.checked).value;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        role: selectedRole,
      }),
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

const onHandleSignin = (e) => {
  e.preventDefault();
  window.location.assign("/");
};

// EVENT LISTENERS
REGISTER_BUTTON.addEventListener("click", async (e) => {
  await onHandleLogin(e);
});

SIGNIN_BUTTON.addEventListener("click", (e) => {
  REGISTER_BUTTON.removeEventListener("click", onHandleLogin);
  SIGNIN_BUTTON.removeEventListener("click", onHandleSignin);
  onHandleSignin(e);
});
