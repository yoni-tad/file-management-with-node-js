document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");

  checkUser();
  document.getElementById("uploadFile").onchange = uploadFile;

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
        console.log(data.message);
        globalThis.firstName = data.firstName;
        globalThis.lastName = data.lastName;
        globalThis.email = data.email;
        globalThis.quota = data.quota;
        globalThis.role = data.role;
      } else {
        console.log("Failed to fetch data");
        window.location.href = `login.html?status=error&message=${data.message}`;
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html";
    }
  }

  // Upload files
  async function uploadFile(e) {
    e.preventDefault();

    console.log("upload started");
    document.getElementById('progressForm').style.display = 'block'

    const fileInput = document.getElementById("uploadFile");
    const file = fileInput.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const newQuota = quota + fileSize
    
    if (fileSize > 524288000) {
      return console.log("Max upload upto 500 MB");
    } else if (role == "user" && newQuota > 52428800) {
      return console.log("Your quota is full use premium");
    } else if (role == "premium" && newQuota > 157286400) {
      return console.log("Your quota is full");
    }

    const formData = new FormData();
    formData.append("size", fileSize)
    formData.append("path", "/");
    formData.append("email", email);
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${domain}/api/file/upload-folder`, true);
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        document.getElementById('fileName').innerText = fileName
        document.getElementById('fileSize').innerText = `${(fileSize / (1024 *1024)).toFixed(2)} MB`
        document.getElementById('percentBar').style.width = `${percentComplete}%`
        document.getElementById('percentValue').innerText = `${percentComplete}%`
      }
    };
    xhr.onload = function() {
      if (xhr.status === 201) {
        console.log("Success:", JSON.parse(xhr.responseText).message);
      } else {
        console.log("Error:", JSON.parse(xhr.responseText).message);
      }
    }

    xhr.onerror = function () {
      console.error("Upload failed.");
    };

    xhr.send(formData)
  }
});
