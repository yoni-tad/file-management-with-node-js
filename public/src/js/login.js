const domain = "http://localhost:3000";

async function Login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${domain}/api/auth/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data);
      window.location.href = 'home.html'
    } else {
      console.log("Error: " + data.message);
    }
  } catch (e) {
    console.log(`Error at login: ${e}`);
  }
}

document.getElementById("login").addEventListener("click", Login);
