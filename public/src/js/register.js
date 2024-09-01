const domain = "http://localhost:3000";

async function Register(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${domain}/api/auth/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
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
      window.location.href = 'login.html'
    } else {
      console.log("Error: " + data.message);
    }
  } catch (e) {
    console.log(`Error at registration: ${e}`);
  }
}

document.getElementById("register").addEventListener("click", Register);
