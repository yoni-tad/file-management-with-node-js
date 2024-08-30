document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");

  checkUser()
  document.getElementById("upload").addEventListener("click", uploadFile);

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
        console.log(data.message);
        globalThis.firstName = data.firstName;
        globalThis.lastName = data.lastName;
        globalThis.email = data.email;
        // document.getElementById("fullName").innerHTML = `${data.firstName} ${data.lastName}`;
      } else {
        console.log("Failed to fetch data");
        window.location.href = `login.html?status=error&message=${data.message}`;
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html";
    }
  }

  async function uploadFile(e) {
    e.preventDefault();

    console.log("upload clicked");

    const file = document.getElementById("uploadFile");
    const formData = new FormData();
    formData.append("path", "/");
    formData.append("email", email);
    formData.append("file", file.files[0]);

    const response = await fetch(
      "http://localhost:3000/api/file/upload-folder",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      console.log("Success: " + data.message);
    } else {
      console.log("Error: " + data.message);
    }
  }

});
