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

const showLoader = () => LOADER_COMPONENT.classList.remove("hidden");
const hideLoader = () => LOADER_COMPONENT.classList.add("hidden");
