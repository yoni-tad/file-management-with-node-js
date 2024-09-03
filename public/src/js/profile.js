document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
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
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);
        localStorage.setItem("email", data.email);
        localStorage.setItem("quota", data.quota);
        localStorage.setItem("role", data.role);
      } else {
        console.log("Failed to fetch data");
        window.location.href = "login.html?status=error&message=Try again";
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html?status=error&message=Try again";
    }
  }
});
