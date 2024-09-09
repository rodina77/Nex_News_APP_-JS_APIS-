let register_token = "";
function Register() {
  username = document.getElementById("username").value;
  namee = document.getElementById("name").value;
  password = document.getElementById("password").value;
  img = document.getElementById("registerimg").files[0];

  formData = new FormData();
  formData.append("username", username);
  formData.append("name", namee);
  formData.append("password", password);
  formData.append("image", img);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData)
    .then((response) => {
      token = response.data.token;
      localStorage.setItem("register_token", register_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      Swal.fire("Your Account Created Succssesfully!");
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