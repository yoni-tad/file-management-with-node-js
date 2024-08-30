document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");
  const path = localStorage.setItem("path", "/");

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
        globalThis.firstName = data.firstName;
        globalThis.lastName = data.lastName;
        globalThis.email = data.email;
        globalThis.quota = data.quota;
        globalThis.role = data.role;

        document.getElementById("quotaMB").textContent = `${
          Math.round((quota / (1024 * 1024)) * 10) / 10
        } MB`;
        document.getElementById("totalQuota").textContent =
          role == "user" ? `50 MB` : `150 MB`;
      } else {
        console.log("Failed to fetch data");
        window.location.href = `login.html?status=error&message=${data.message}`;
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = `login.html?error=${e}`;
    }
  }

  //   add path
  async function addPath() {
    const currentPath = localStorage.getItem('path')
    console.log('current path: ' + currentPath)
    const updatePath = localStorage.setItem('path', `${currentPath}docs/`)
    const newPath = localStorage.getItem('path')
    console.log('Update path: ' + newPath)
  }
  
  addPath();
});
