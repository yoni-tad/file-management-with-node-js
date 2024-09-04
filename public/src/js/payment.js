document.addEventListener("DOMContentLoaded", async () => {
  const domain = "https://fileframe.ynitsolution.com";
  const currentUrl = new URL(window.location.href);
  const urlRef = currentUrl.searchParams.get("tx_ref");

  paymentCallback()

  async function paymentCallback() {
    console.log('paymentCallback')
    const response = await fetch(`${domain}/api/auth/payment-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tx_ref: urlRef, status: "Success" }),
    });

    if(response.ok){
        console.log(`success`)
    } else {
        console.log(`Have error`)
    }
  }
});
