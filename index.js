function get_all_posts(reload = true, page = 1) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`)
    .then((response) => {
      let posts = response.data.data;
      for (post of posts) {
        let user = currentUser();
        let isMyPost = user && post.author.id == user.id;
        let buttonContent = ``;
        if (isMyPost) {
          buttonContent = `
          <button class="delete-btn btn-danger" onclick="delete_post('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Delete</button>
          <button class="edit-btn" onclick="edit_post('${encodeURIComponent(
            JSON.stringify(post)
          )}')">Edit</button>
          `;
        }

        document.getElementById("card").innerHTML += `
            <div class="card mb-3">
              <div class="border border-4 profile-card">
                <img src="${post.author.profile_image}" class="user_profile_photo" onclick="get_specific_user(${post.author.id})" width="50px" alt="user_image">
                <p class="profile_name">${post.author.username}</p>
                ${buttonContent}
              </div>
              <img src="${post.image}" width="100px" height="400px" class="card-img-top" alt="post img">
              <div class="card-body">
                <h5 id="post_time" class="card_time-title">${post.author.created_at}</h5>
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.body}</p>
                <hr>
                <p class="card-text"><small class="text-body-secondary">
                      <a class="card-comment" onclick="get_specific_post(${post.id})">  ${post.comments_count} comments</a>
                </small></p>
              </div>
            </div>
                `;
      }
    });
}

get_all_posts();

function get_specific_post(post_id) {
  window.location = `/postDetails.html?post_id=${post_id}`;
}
function get_specific_user(user_id) {
  window.location = `/profile_page.html?user_id=${user_id}`;
}

// Function to fetch post details using post_id from the URL
function fetchPostDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const post_id = urlParams.get("post_id");

  axios.get(`https://tarmeezacademy.com/api/v1/posts/${post_id}`)
    .then((response) => {
      const post = response.data.data;

      document.getElementById("card2").innerHTML = `
        <div class="card mb-3">
          <h1 style="text-align:center">${post.author.name}</h1>
          <div class="border border-4 profile-card">
            <img src="${post.author.profile_image}" width="50px" alt="user_image">
            <p class="profile_name">${post.author.username}</p>
          </div>
          <img src="${post.image}" width="100px" height="400px" class="card-img-top" alt="post img">
          <div class="card-body">
            <h5 class="card_time-title">${post.created_at}</h5>
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.body}</p>
            <hr>
            <div id="comments-container">
              <div id="comments"></div> 
              <div class="add_your_comment">
                <input type="text" class="comment_input" placeholder="Type your comment here" id="add_comment_input">
                <button id="add_new_comment" class="btn-comment" onclick="add_new_comment(${post.id})">Send</button>
              </div>
            </div>
          </div>
        </div>
      `;

      let commentsHTML = ""; // Initialize an empty string for comments
      let comments = post.comments;

      for (let comment of comments) {
        commentsHTML += `
          <div class="card-comments_content" id="comments_content">
            <div class="card-comments_contents">
              <img class="rounded-circle" src="${comment.author.profile_image}" width="80px" height="40px" alt="">
              <h4 class="user_profile_name">${comment.author.username}</h4>
            </div>
            <p class="class_body">${comment.body}</p>
          </div>
        `;
      }

      document.getElementById("comments").innerHTML = commentsHTML;
    })
    .catch((error) => {
      console.error("Error fetching post details:", error);
    });
}


function fetchUserProfileDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const user_id = urlParams.get("user_id");

  axios.get(`https://tarmeezacademy.com/api/v1/users/${user_id}`)
    .then((response) => {
      const user = response.data.data;

      document.getElementById("user_page").innerHTML = `
        <h1 class="h1_user_name">${user.username}'s profile page</h1>
        <div class="user_interactions">
          <img src="${user.profile_image}" width="200px" style="border-radius: 50%;" alt="Profile Image">
          <div class="interaction_count">
            <h2>${user.comments_count} comments</h2>
            <h2>${user.posts_count} posts</h2>
          </div>
        </div>
        <div class="user_posts">
          <h1 class="h1_user_name">${user.name}'s posts</h1>
          <div id="test" class="container"></div>
        </div>
      `;

      return axios.get(`https://tarmeezacademy.com/api/v1/users/${user_id}/posts`);
    })
    .then((response) => {
      let posts = response.data.data;
      document.getElementById("test").innerHTML = ""; // Clear previous posts

      for (let post2 of posts) {
        let user = currentUser();
        let isMyPost = user && post2.author.id == user.id;
        let buttonContent = ``;
        
        if (isMyPost) {
          buttonContent = `
            <button class="delete-btn btn-danger" onclick="delete_post('${encodeURIComponent(JSON.stringify(post2))}')">Delete</button>
            <button class="edit-btn" data-bs-toggle="modal" data-bs-target="#EditexampleModal" onclick="edit_post('${encodeURIComponent(JSON.stringify(post2))}')">Edit</button>
          `;
        }
        
        document.getElementById("test").innerHTML += `
          <div class="card mb-3">
            <div class="border border-4 profile-card">
              <img src="${post2.author.profile_image}" onclick="get_specific_user(${post2.author.id})" width="50px" alt="starry_night">
              <p class="profile_name">${post2.author.username}</p>
              ${buttonContent}
            </div>
            <img src="${post2.image}" width="100px" height="400px" class="card-img-top" alt="coffee img">
            <div class="card-body">
              <h5 class="card_time-title">${post2.created_at}</h5>
              <h5 class="card-title">${post2.title}</h5>
              <p class="card-text">${post2.body}</p>
              <hr>
              <p class="card-text"><small class="text-body-secondary">
                <a class="card-comment" onclick="get_specific_post(${post2.id})">${post2.comments_count} comments</a>
              </small></p>
            </div>
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching user details or posts:", error);
    });
}
// Call the function on page load

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const post_id = urlParams.get("post_id");
  const user_id = urlParams.get("user_id");

  if (post_id) {
    fetchPostDetails(); // Fetch post details if post_id is present
  } else if (user_id) {
    fetchUserProfileDetails(); // Fetch user profile details if user_id is present
  }
};


let currentpage = 1;

window.addEventListener("scroll", function () {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    get_all_posts(false, currentpage + 1);
    currentpage++;
  }
});


function currentUser() {
  let user = localStorage.getItem("user");
  let userString = JSON.parse(user);
  document.getElementById("user_profile_img").innerHTML = `
    <img class="user_profile_image" src="${userString.profile_image}" onclick="get_specific_user(${userString.id})" alt="">`;
  document.getElementById("profile-link").innerHTML = `
    <a class="navbar-brand" style="color: rgb(99, 99, 99); font-weight: 500px; cursor: pointer;" onclick="get_specific_user(${userString.id})">profile</a>`;
  return user ? JSON.parse(user) : null;

}

currentUser();

function logout() {
  localStorage.removeItem("token");
  window.location = "/user_login/login.html";
}

var myModal = document.getElementById("myModal");
var myInput = document.getElementById("myInput");

myModal.addEventListener("shown.bs.modal", function () {
  myInput.focus();
});

function add_new_post() {
  post_title = document.getElementById("post_title").value;
  post_body = document.getElementById("post_body").value;
  post_image = document.getElementById("post_image").files[0];
  token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("body", post_body);
  formData.append("title", post_title);
  formData.append("image", post_image);

  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      get_all_posts(); // Refresh the posts list
      // Hide the modal
      var modalElement = document.getElementById("exampleModal");
      var modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        var newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
      }
      document.querySelector(".modal-backdrop")?.remove();
    })
    .catch((error) => {
      console.error("Error adding/updating post:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${
          error.response.data.message ||
          "An error occurred while processing your request."
        }`,
      });
    });
}

function add_new_comment(post_id) {
  let input_comment_val = document.getElementById("add_comment_input").value;
  let token = localStorage.getItem("token");
  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${post_id}/comments`,
      {
        body: input_comment_val,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      document.getElementById("add_comment_input").value = "";
      get_all_posts();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      console.log(error.response.data.message);
    });
}

function edit_post(postobj) {
  let post = JSON.parse(decodeURIComponent(postobj));
  console.log("Editing Post ID:", post.id);  // Debugging line
  console.log("function called but modal no");  // Debugging line
  
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("edit_post_title").value = post.title;
  document.getElementById("edit_post_body").value = post.body;

  let postModal = new bootstrap.Modal(document.getElementById("EditexampleModal"), {});
  postModal.show(); 

}

function delete_post(postobj) {
  let post = JSON.parse(decodeURIComponent(postobj));
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      confirm_delete(post.id);
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

function confirm_delete(post_id) {
  const token = localStorage.getItem("token");
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${post_id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Post deleted successfully:", response.data); // Log success response
      get_all_posts(); // Refresh the posts list
    })
    .catch((error) => {
      console.error("Error deleting post:", error.response || error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${
          error.response?.data.message ||
          "An error occurred while trying to delete the post."
        }`,
      });
    });
}

function edit_existing_post() {
  // Get the post ID from the modal input
  const post_id = document.getElementById("post-id-input").value;
  console.log("Updating Post ID:", post_id); // Confirm the post ID

  // Get values from the input fields for title and body
  const edit_post_title = document.getElementById("edit_post_title").value;
  const edit_post_body = document.getElementById("edit_post_body").value;
  const edit_post_image = document.getElementById("edit_post_image").files[0]; // Ensure this matches your file input
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Verify token exists

  // Create a new FormData object
  let formData = new FormData();
  formData.append("body", edit_post_body);
  formData.append("title", edit_post_title);
  formData.append("_method", "put");
  formData.append("image", edit_post_image);

  // PUT request to update the post
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${post_id}`, formData, {
      // Use post_id
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      var modalElement = document.getElementById("EditexampleModal");
      var modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      
      // Remove the backdrop overlay
      document.querySelector(".modal-backdrop")?.remove();

      console.log("Post updated successfully:", response.data); // Log success response
      get_all_posts(); // Refresh the posts list
    })
    .catch((error) => {
      console.error("Error updating post:", error.response || error);
    });
}
