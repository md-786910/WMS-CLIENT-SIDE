import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export const addSpinner = (event) => {
  event.target.innerHTML =
    '<div class="spinner-border spinner-border-sm text-white " role="status" />';
  event.target.disabled = true;
};
export const removeSpinner = (event, text = "add to cart") => {
  event.target.innerHTML = text;
  event.target.disabled = false;
};

export const toastWarning = (text) => {
  toast.error(text, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showToastSuccess = (text) => {
  toast.success(text, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
export const showToastError = (text) => {
  toast.error(text?.response?.data?.message || text?.message || text, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const SpinnerRole = () => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
};
