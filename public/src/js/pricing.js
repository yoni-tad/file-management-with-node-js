document.addEventListener("DOMContentLoaded", async () => {
  const domain = "https://fileframe.ynitsolution.com";
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
        globalThis.email = data.email;
        localStorage.setItem("email", data.email);
        globalThis.role = data.role;
        if(role == 'premium') {
          document.getElementById('paymentInit').textContent = 'Thanks for use premium'
          document.getElementById('paymentInit').disabled = true
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

  async function payment() {
    const email = localStorage.getItem("email");
    const response = await fetch(`${domain}/api/auth/initialize-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "1",
        email: email
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
