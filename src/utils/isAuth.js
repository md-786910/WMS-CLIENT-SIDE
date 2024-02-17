export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return true;
  }
  if (localStorage.getItem("userAuth")) {
    return JSON.parse(localStorage.getItem("faceAuth"));
  } else {
    return false;
  }
};

// signout
export const handleLogout = () => {
  if (localStorage.getItem("faceAuth")) {
    localStorage.removeItem("faceAuth");
    window.location.reload();
    return true;
  }
};
