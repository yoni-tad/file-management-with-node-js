const domain = "https://file-management-with-node-js.onrender.com";
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
function isEmpty(str) {
  return !str.trim().length;
}

const currentUrl = new URL(window.location.href);
const urlStatus = currentUrl.searchParams.get("status");
const urlMessage = currentUrl.searchParams.get("message");

if (urlStatus == "success") toastr.success(urlMessage);
if (urlStatus == "error") toastr.error(urlMessage);

async function Login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isEmpty(email) && isEmpty(password)) {
    return toastr.error("Please fill all fields");
  }

  try {
    const response = await fetch(`${domain}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data);
      window.location.href = "home.html?status=success&message=Welcome back to FileFrame";
    } else {
      console.log("Error: " + data.message);
      return toastr.error(data.message);
    }
  } catch (e) {
    console.log(`Error at login: ${e}`);
  }
}

document.getElementById("login").addEventListener("click", Login);
