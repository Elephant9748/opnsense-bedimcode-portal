console.clear();

/*===== FOCUS =====*/
const inputs = document.querySelectorAll(".form__input");

/*=== Add focus ===*/
function addfocus() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

/*=== Remove focus ===*/
function remfocus() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addfocus);
  input.addEventListener("blur", remfocus);
});

/*=== Simple Modal===*/
const modal = document.querySelector(".modal");
const btnlogin = document.querySelector(".form__button");
const closeButton = document.querySelector(".close-button");
// let btnlogin = document.getElementById("btnlogin");
let btnanom = document.getElementById("btnanom");
let btnlogout = document.getElementById("btnlogout");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

btnlogin.addEventListener("click", () => {
  // toggleModal();
  userAuthLogin();
});
btnanom.addEventListener("click", userAuthAnonym);
btnlogout.addEventListener("click", userLogout);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

/*=== Axios Resuest===*/
let user = document.getElementById("inputUsername");
let pass = document.getElementById("inputPassword");
let modalmsg = document.getElementById("modal-msg");
let msgstatus = document.getElementById("msg-status");

//Test Input
function isInput() {
  modalmsg.innerText = "username: " + user.value + " | password: " + pass.value;
  console.log(msgstatus);
  msgstatus.setAttribute(
    "style",
    "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
  );
  msgstatus.innerText = "unable to connect account not authorized...!";
}

function getURLparams() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

// normal login
function userAuthLogin() {
  axios({
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    url: "/api/captiveportal/access/logon/",
    data: "user=" + user.value + "&password=" + pass.value,
  })
    .then(function (response) {
      // success login
      console.log(response.data);
      if (response.data.clientState == "AUTHORIZED") {
        if (getURLparams()["redirurl"] != undefined) {
          window.location = "http://" + getURLparams()["redirurl"] + "?refresh";
        } else {
          window.location.reload();
        }
      } else {
        user.value = "";
        pass.value = "";
        msgstatus.setAttribute(
          "style",
          "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
        );
        msgstatus.innerText = "Authorized failed wrong username or password";
      }
    })
    .catch(function (error) {
      console.log(error);
      msgstatus.setAttribute(
        "style",
        "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
      );
      msgstatus.innerText = "unable to connect to  authentication server";
    });
}

// login anomymous
function userAuthAnonym() {
  const user_anonym = "";
  const pass_anonym = "";
  axios({
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    url: "/api/captiveportal/access/logon/",
    data: "user=" + user_anonym + "&password=" + pass_anonym,
  })
    .then(function (response) {
      // success login
      console.log(response.data);
      if (response.data.clientState == "AUTHORIZED") {
        if (getURLparams()["redirurl"] != undefined) {
          window.location = "http://" + getURLparams()["redirurl"] + "?refresh";
        } else {
          window.location.reload();
        }
      } else {
        user.value = "";
        pass.value = "";
        msgstatus.setAttribute(
          "style",
          "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
        );
        msgstatus.innerText = "Authorized failed wrong username or password";
      }
    })
    .catch(function (error) {
      console.log(error);
      msgstatus.setAttribute(
        "style",
        "text-align:right;visibility:hidden;color:#E54A20;font-weight:bold;",
      );
      msgstatus.innerText = "unable to connect to  authentication server";
    });
}

// logout

function userLogout() {
  msgstatus.setAttribute(
    "style",
    "text-align:right;visibility:hidden;color:#E54A20;font-weight:bold;",
  );
  msgstatus.innerText = "";
  const logoff = "";
  axios({
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    url: "/api/captiveportal/access/logoff/",
    data: "user=" + logoff + "&password=" + logoff,
  })
    .then(function (response) {
      window.location.reload();
    })
    .catch(function (error) {
      msgstatus.setAttribute(
        "style",
        "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
      );
      msgstatus.innerText = "unable to connect to  authentication server";
    });
}

function userStatus() {
  axios({
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    url: "/api/captiveportal/access/status/",
    data: "user=" + user.value + "&password=" + pass.value,
  })
    .then(function (response) {
      if (response.data.clientState == "AUTHORIZED") {
        btnlogin.style.display = "none";
        btnanom.style.display = "none";
        btnlogout.style.display = "block";
        document.getElementById("block_input").style.display = "none";
      } else if (response.data.authType == "none") {
        btnlogin.style.display = "none";
        btnanom.style.display = "block";
        btnlogout.style.display = "none";
        document.getElementById("block_input").style.display = "block";
      } else {
        btnlogin.style.display = "block";
        btnanom.style.display = "none";
        btnlogout.style.display = "none";
        document.getElementById("block_input").style.display = "block";
      }
    })
    .catch(function (error) {
      msgstatus.setAttribute(
        "style",
        "text-align:right;visibility:visible;color:#E54A20;font-weight:bold;",
      );
      msgstatus.innerText = "unable to connect to  authentication server";
    });
}

userStatus();
