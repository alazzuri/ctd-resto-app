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
