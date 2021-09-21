const onHandleRegister = async (e) => {
  e.preventDefault();

  const firstName = document.querySelector("#inputFirstname").value;
  const lastName = document.querySelector("#inputLastname").value;
  const email = document.querySelector("#inputEmail").value;
  const password = document.querySelector("#inputPassword").value;
  const radioInputs = [...document.querySelectorAll(".form-check-input")];
  const selectedRole = radioInputs.find((input) => input.checked).value;
  const ERROR_TEXT_COMPONENT = document.querySelector("#errorMessage");

  if (!firstName || !lastName || !email || !password)
    return (ERROR_TEXT_COMPONENT.textContent =
      "Alguno de los datos está incompleto");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  showLoader();
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
    ERROR_TEXT_COMPONENT.textContent = error;
    console.log(error);
    hideLoader();
  }
};

const onHandleSignin = (e) => {
  e.preventDefault();
  window.location.assign("/");
};

// EVENT LISTENERS
REGISTER_BUTTON.addEventListener("click", async (e) => {
  await onHandleRegister(e);
});

SIGNIN_BUTTON.addEventListener("click", (e) => {
  REGISTER_BUTTON.removeEventListener("click", onHandleRegister);
  SIGNIN_BUTTON.removeEventListener("click", onHandleSignin);
  onHandleSignin(e);
});
