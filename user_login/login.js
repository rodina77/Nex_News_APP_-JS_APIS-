let token = "";

function login() {
  let username = document.getElementById("recipient-email").value;
  let password = document.getElementById("recipient-pass").value;

  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: username,
      password: password,
    })
    .then((response) => {
      token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Swal.fire("successful login!");
      window.location = "/index.html";
    })
    .catch((error) => {
      let errorMessage = "Oops... Something went wrong.";
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(", ");
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${errorMessage}`,
      });
    });
}
