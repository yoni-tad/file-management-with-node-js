const domain = "http://localhost:3000";
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

async function Register(e) {
  e.preventDefault();
  function isEmpty(str) {
    return !str.trim().length;
  }
  function checkLength(str) {
    return str.trim().length;
  }
  function validateEmail(email){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };  

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isEmpty(firstName) && isEmpty(lastName) && isEmpty(email) && isEmpty(password)) {
    return toastr.error("Please fill all fields");
  } else {
    if (checkLength(firstName) < 2) return toastr.error("Please fill valid first name");
    if (checkLength(lastName) < 2) return toastr.error("Please fill valid last name");
    if (!validateEmail(email)) return toastr.error("Please fill valid email");
    if (checkLength(password) < 5) return toastr.error("Please fill password more than 5 character");
  }

  try {
    const response = await fetch(`${domain}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      window.location.href = "login.html?status=success&message=Registration successful, please sign in to account!";
    } else {
      return toastr.error(data.message);
    }
  } catch (e) {
    console.log(`Error at registration: ${e}`);
  }
}

document.getElementById("register").addEventListener("click", Register);
