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
      } else {
        console.log("Failed to fetch data");
        window.location.href = "login.html?status=error&message=Try again";
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html?status=error&message=Try again";
    }
  }

  async function payment() {
    const raw = JSON.stringify({
      amount: "1",
      currency: "ETB",
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "0964582841",
      tx_ref: "file-" + Math.floor(Math.random() * 10000),
      callback_url: `${domain}/home.html?status=success&message=Payment Done`,
      return_url: `${domain}/home.html`,
      "customization[title]": "Payment for file management",
      "customization[description]": "Thanks",
      "meta[hide_receipt]": "true",
    });

    const response = await fetch(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer `,
        },
        body: raw,
        redirect: "follow",
      }
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  document.getElementById("paymentInit").addEventListener("click", payment);
});
