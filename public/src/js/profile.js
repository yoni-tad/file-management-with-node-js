document.addEventListener("DOMContentLoaded", async () => {
  const domain = "https://fileframe.ynitsolution.com";
  const token = localStorage.getItem("token");
  checkUser();
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

  // Check user whether authenticated or not
  async function checkUser() {
    try {
      const response = await fetch(`${domain}/api/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        globalThis.firstName = data.firstName;
        globalThis.lastName = data.lastName;
        globalThis.email = data.email;
        globalThis.quota = data.quota;
        globalThis.role = data.role;
        document.getElementById("firstName").value = firstName;
        document.getElementById("lastName").value = lastName;
        document.getElementById("email").value = email;
        if(role == 'premium') {
          document.getElementById('pricing').style.display = 'none'
        }
      } else {
        console.log("Failed to fetch data");
        window.location.href = "login.html?status=error&message=Try again";
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html?status=error&message=Try again";
    }
  }

  async function updateProfile() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${domain}/api/auth/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        password: password,
      }),
    });

    if (response.ok) {
      document.getElementById("firstName").value = firstName
      document.getElementById("lastName").value = lastName
      document.getElementById("password").value = ''
      toastr.success("Profile update successfully");
    } else {
      toastr.error("Try again");
    }
  }

  document
    .getElementById("updateProfile")
    .addEventListener("click", updateProfile);
});
