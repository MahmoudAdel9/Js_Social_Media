function loginBtnClicked() {
  let username = document.getElementById("name-text").value;
  let userPassword = document.getElementById("password-text").value;
  let params = {
    username: username,
    password: userPassword,
  };
  showSpinner(true);
  axios
    .post("https://tarmeezacademy.com/api/v1/login", params)
    .then(function (response) {
      console.log(response.data);
      let userName = response.data.user.username;
      let token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      exitModal("loginModal");
      myAlert("Logged in successfully!");
      btnState();
      showUserName(userName);
    })
    .catch((error) => {
      let errorMsg = error.response.data.message;
      myAlert(errorMsg, "danger");
    })
    .finally(() => {
      showSpinner(false);
    });
}

async function addPost() {
  showSpinner(true);
  let postBody = document.getElementById("post-text").value;
  let image = document.getElementById("post-image");
  let token = localStorage.getItem("token");
  try {
    const { data } = await axios.post(
      "https://tarmeezacademy.com/api/v1/posts",
      {
        body: postBody,
        image: image.files[0],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    myAlert("Your post has been added");
    exitModal("addPostModal");
    getPosts();
    showSpinner(false);
    data.author.profile_image = localStorage.getItem("userImage");
  } catch (error) {
    myAlert(error.response.data.message, "danger");
    showSpinner(false);
  }
}

function exitModal(id) {
  let loginModal = document.getElementById(id);
  let modalInstance = bootstrap.Modal.getInstance(loginModal);
  modalInstance.hide();
}

function btnState() {
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  let userValues = JSON.parse(user);
  let loginBtn = document.getElementById("sign-in-btn");
  let signupBtn = document.getElementById("sign-up-btn");
  let logoutBtn = document.getElementById("logout-btn");

  if (token == null) {
    loginBtn.style.display = "block";
    signupBtn.style.display = "block";
    logoutBtn.style.display = "none";
    document.getElementById("add-post").style.display = "none";
    document.getElementById("logo-image").src =
      "imgs/403017_avatar_default_head_person_unknown_icon.svg";
    document.getElementById("commentInput").style.display = "none";
  } else {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "block";
    document.getElementById("add-post").style.display = "block";
    document.getElementById("logo-image").src = userValues.profile_image;
    document.getElementById("commentInput").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  myAlert("Logged out successfully!");
  btnState();
  hideUserName();
}

async function signupBtnClicked() {
  let name = document.getElementById("name-text-reg").value;
  let username = document.getElementById("username-text-reg").value;
  let userPassword = document.getElementById("password-text-reg").value;
  let userImage = document.getElementById("user-image").files[0];
  showSpinner(true);
  try {
    const { data } = await axios.post(
      "https://tarmeezacademy.com/api/v1/register",
      {
        name: name,
        username: username,
        password: userPassword,
        image: userImage,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    showSpinner(false);
    let token = data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(data.user));
    exitModal("signupModal");
    myAlert("An account has been created successfully!");
    btnState();
    showUserName(username);
    localStorage.setItem("userImage", data.user.profile_image);
    console.log(data);
  } catch (error) {
    myAlert(error.response.data.message, "danger");
    showSpinner(false);
  }

  // let params = {
  //   name: name,
  //   username: username,
  //   password: userPassword,
  // };
  // axios
  //   .post("https://tarmeezacademy.com/api/v1/register", params)
  //   .then(function (response) {
  //     console.log(response);
  //     let token = response.data.token;
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("user", JSON.stringify(response.data.user));
  //     exitModal("signupModal");
  //     myAlert("Registered successfully!");
  //     btnState();
  //     showUserName(username);
  //   })
  //   .catch(function (error) {
  //     let errorMsg = error.response.data.message || "error";
  //     myAlert(errorMsg, "danger");
  //   });
}

function showUserName(username) {
  if (username != null) {
    document.getElementById("user-name-show").innerHTML = `Hi ${username}`;
    localStorage.setItem("username", username);
  }
}

function hideUserName() {
  document.getElementById("user-name-show").innerHTML = ``;
}

function isUserExist() {
  if (localStorage.getItem("username") != null) {
    document.getElementById(
      "user-name-show"
    ).innerHTML = `Hi ${localStorage.getItem("username")}`;
  } else {
    hideUserName();
  }
}

function commentBtnClicked(postId) {
  window.location = "./postDetails.html?postId=" + postId;
}

async function sendComment(id) {
  let token = localStorage.getItem("token");
  let yourComment = document.getElementById("comment-text").value;
  showSpinner(true);
  try {
    const { data } = await axios.post(
      `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
      {
        body: yourComment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    document.getElementById("commentSection").innerHTML += `
          <div class="card mb-3 mt-1" style = "background-color: #f0ecff;" >
            <div class="card-body">
              <div class="d-flex flex-start">
                <img class="rounded-circle shadow-1-strong me-3" onclick="userClicked(${data.data.author.id})"
                  src="${data.data.author.profile_image}" alt="avatar" style="width: 35px; height: 35px; cursor: pointer;" />
                <div class="w-100" >
                  <div class="d-flex flex-column align-items-start">
                    <h6 onclick="userClicked(${data.data.author.id})" class="text-primary fw-bold mb-0 " style="margin-bottom: 2.5px; cursor: pointer;">
                      ${data.data.author.username}
                    </h6>
                    <span class="text-dark mt-1" style="text-align: left; ">
                      ${data.data.body}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div >
        </div >
          `;
    myAlert("Your Comment has been added");
    console.log(data.data);
    showSpinner(false);
  } catch (error) {
    myAlert(error.response.data.message, "danger");
    showSpinner(false);
  }

  document.getElementById("comment-text").value = "";
  showPostDetails();
}

let postId = "";
function updatePost(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("update_id_input").value = post.id;
  let textInput = document.getElementById("update-text");
  textInput.value = post.body;
  console.log(post);
}

async function update() {
  let postUpdateId = document.getElementById("update_id_input").value;
  let postBody = document.getElementById("update-text").value;
  let image = document.getElementById("update-image");
  let token = localStorage.getItem("token");
  showSpinner(true);
  try {
    const { data } = await axios.post(
      "https://tarmeezacademy.com/api/v1/posts/" + postUpdateId,
      {
        body: postBody,
        _method: "put",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    myAlert("Your post has been Updated");
    exitModal("updatePostModal");
    getPosts();
    getUserPosts();
    getUser();
    data.author.profile_image = localStorage.getItem("userImage");
    showSpinner(false);
  } catch (error) {
    myAlert(error.response.data.error_message, "danger");
    showSpinner(false);
  }
}

async function deletePostClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("delete_id_input").value = post.id;
}

async function deletePost() {
  let postDeleteId = document.getElementById("delete_id_input").value;
  let token = localStorage.getItem("token");
  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  showSpinner(true);
  axios
    .delete(`https://tarmeezacademy.com/api/v1/posts/${postDeleteId}`, {
      headers: headers,
    })
    .then(function (response) {
      console.log(response.data);
      exitModal("deletePostModal");
      myAlert("Your post has been deleted");
      getPosts();
      getUserPosts();
      getUser();
    })
    .catch((error) => {
      let errorMsg = error.response.data.message;
      myAlert(errorMsg, "danger");
    })
    .finally(() => {
      showSpinner(false);
    });

  getPosts();
}

function userClicked(userId) {
  window.location = "./profile.html?userId=" + userId;
}

function profileClicked() {
  let user = localStorage.getItem("user");
  let userId = "";
  if (user != null) {
    let userValues = JSON.parse(user);
    userId = userValues.id;
  }

  window.location = "./profile.html?userId=" + userId;
}

function showSpinner(show = true) {
  if (show) {
    document.getElementById("spinner").style.visibility = "visible";
  } else {
    document.getElementById("spinner").style.visibility = "hidden";
  }
}

function myAlert(text, state = "success") {
  const alertPlaceholder = document.getElementById("alert-success");
  alertPlaceholder.innerHTML = `<div id="alert-for-delete" class="alert alert-${state} show fade" role="alert"
    style="position: fixed; bottom: 0; right: 20px; z-index: 99999; width: 250px">
    ${text}
    </div>`;

  // hide it after 2 seconds
  const alert = bootstrap.Alert.getOrCreateInstance("#alert-for-delete");
  setTimeout(() => {
    alert.close();
  }, 2000);
}

let switchBtn = document.getElementById("switch-btn");
async function changeMode() {
  let toggleSwitch = document.getElementById("switch");
  await toggleSwitch.addEventListener("change", () => {
    if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
      document.documentElement.setAttribute("data-bs-theme", "light");
      document.getElementById("nav").style.cssText =
        "background-color: #2b3035 !important;";
      localStorage.setItem("theme", "light");
      localStorage.setItem("nav", "#2b3035");
      switchBtn.classList.remove("switch-btn-on");
      localStorage.setItem("toggleState", "off");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      document.getElementById("nav").style.cssText =
        "background-color: black !important;";
      localStorage.setItem("theme", "dark");
      localStorage.setItem("nav", "black");
      switchBtn.classList.add("switch-btn-on");
      localStorage.setItem("toggleState", "on");
    }
  });
  saveMode();
}

function saveMode() {
  document.documentElement.setAttribute(
    "data-bs-theme",
    localStorage.getItem("theme")
  );

  document.getElementById(
    "nav"
  ).style.cssText = `background-color: ${localStorage.getItem(
    "nav"
  )} !important;`;

  if (localStorage.getItem("toggleState") === "on") {
    switchBtn.classList.add("switch-btn-on");
  } else {
    switchBtn.classList.remove("switch-btn-on");
  }
}

changeMode();
btnState();
isUserExist();
