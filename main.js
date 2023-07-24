function showSpinner(show = true) {
  if (show) {
    document.getElementById("spinner").style.visibility = "visible";
  } else {
    document.getElementById("spinner").style.visibility = "hidden";
  }
}

// infinte scroll //
let currentPage = 1;
let lastPage = 1;

window.addEventListener("scroll", () => {
  const endOfPage =
    window.innerHeight + Math.ceil(window.scrollY) >=
    document.body.offsetHeight;

  // the right way to do this => make the currentPage < lastPage ..
  //  but i make it like this to return just 20 pages which mean 100 posts
  if (endOfPage && currentPage < 20) {
    getPosts(currentPage + 1, false);
    currentPage++;
  }
});

function getPosts(page = 1, reload = true) {
  showSpinner(true);
  axios
    .get("https://tarmeezacademy.com/api/v1/posts?limit=5&page=" + page)
    .then(function (response) {
      showSpinner(false);
      lastPage = response.data.meta.last_page;
      if (reload) {
        document.getElementById("posts").innerHTML = "";
      }

      let arrOfPosts = response.data.data;
      for (post of arrOfPosts) {
        let editBtn = ``;
        let deleteBtn = ``;
        // Are you the author ?
        // let editBtn = "";

        let user = localStorage.getItem("user");
        if (user != null) {
          let userValues = JSON.parse(user);
          if (userValues.id == post.author.id && userValues != null) {
            editBtn = `<button id="editBtn" type="button" class="btn btn-primary" data-bs-toggle="modal"
            data-bs-target="#updatePostModal" onclick="updatePost('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Edit</button>`;

            deleteBtn = `<button id="deleteBtn" data-bs-toggle="modal"
            data-bs-target="#deletePostModal" type="button" class="btn btn-danger" onclick="deletePostClicked('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Delete</button>`;
          }
        }

        // there is body ??
        let postBody = "";
        if (post.body != null) {
          postBody = post.body;
        }
        // there is user image ?
        let postUserimage =
          "imgs/403017_avatar_default_head_person_unknown_icon.svg";
        if (Object.keys(post.author.profile_image).length != 0) {
          postUserimage = post.author.profile_image;
        }

        // there is post image ?
        let postImage = "imgs/No_Image_Available.jpg";
        if (Object.keys(post.image).length != 0) {
          postImage = post.image;
        }

        document.getElementById("posts").innerHTML += `
        <div class="card text-center post mb-4 shadow">
          <div class="card-header text-start d-flex justify-content-between">
          <div>
          <a class="me-2" onclick="userClicked(${post.author.id})" href="#" style="text-decoration: none;">
              <img src="${postUserimage}" alt="profile-img" style="width: 35px; height:35px" class="rounded-circle">
            </a>
            <span style="cursor: pointer;" class="fw-medium" onclick="userClicked(${post.author.id})">${post.author.username}</span>
          </div>
          <div id="editDiv">
          ${editBtn}
          ${deleteBtn}
          </div>
          </div>

          <div class="card-body">
            <h6 class="card-text text-start fw-medium mb-3 px-3">${postBody}</h6>
            <img
              src="${postImage}"
              alt="post-img" class="w-100 rounded border" style="max-height:630px; width:1200px">
          </div>

          <div class="card-footer d-flex justify-content-between">
          <div class="d-flex">
              <div class="comments" style="cursor: pointer;">
                <img src="imgs/622413_chat_chatterbox_comment_bubble_message_icon.svg" alt="" style="width: 20px;"
                  class="me-1">
                <span onclick="commentBtnClicked(${post.id})"> ${post.comments_count} Comments </span>
              </div>
          </div>
            <div >
            <span> ${post.created_at}</span>
          </div>

          </div>
      </div>
      `;
      }
      console.log(arrOfPosts);
    });
}

getPosts();
