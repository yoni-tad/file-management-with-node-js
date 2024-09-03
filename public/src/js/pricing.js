document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");
  checkUser();

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
    console.log('Payment init')
    const response = await fetch(`${domain}/api/auth/initialize-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "1",
        email: "yoni@gmail.com"
      }),
    });

    const data = await response.json()
    if(response.ok) {
        console.log('URL: ' + data.paymentUrl)
        window.location.href = data.paymentUrl
    } else {
        console.log('Error: ' + data.message)
    }
  }

  document.getElementById("paymentInit").addEventListener("click", payment);
});
