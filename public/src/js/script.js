document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");
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

  const currentUrl = new URL(window.location.href);
  const urlStatus = currentUrl.searchParams.get("status");
  const urlMessage = currentUrl.searchParams.get("message");

  if (urlStatus == "success") toastr.success(urlMessage);
  if (urlStatus == "error") toastr.error(urlMessage);

  checkUser();
  fetchFile();
  document.getElementById("uploadFile").onchange = uploadFile;
  document.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  });
  document.addEventListener("drop", uploadDragFile);

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
        document.getElementById("fullName").textContent = `👋 Hi ${firstName}`;
      } else {
        console.log("Failed to fetch data");
        window.location.href = "login.html?status=error&message=Try again";
      }
    } catch (e) {
      console.log(`Check User Status Error ${e}`);
      window.location.href = "login.html?status=error&message=Try again";
    }
  }

  // upload file by drag
  async function uploadDragFile(e) {
    e.stopPropagation();
    e.preventDefault();
    document.getElementById("progressForm").style.display = "block";

    const file = e.dataTransfer.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const newQuota = quota + fileSize;

    if (fileSize > 25 * (1024 * 1024)) {
      toastr.error("Max upload upto 25 MB");
      return console.log("Max upload upto 500 MB");
    } else if (role == "user" && newQuota > 50 * (1024 * 1024)) {
      toastr.error("Your quota is full use premium");
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full use premium");
    } else if (role == "premium" && newQuota > 150 * (1024 * 1024)) {
      toastr.error("Your quota is full");
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full");
    }

    const formData = new FormData();
    formData.append("size", fileSize);
    formData.append("path", "/");
    formData.append("email", email);
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${domain}/api/file/upload-folder`, true);
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        document.getElementById("fileName").innerText = fileName;
        document.getElementById("fileSize").innerText = `${(
          fileSize /
          (1024 * 1024)
        ).toFixed(2)} MB`;
        document.getElementById(
          "percentBar"
        ).style.width = `${percentComplete}%`;
        document.getElementById(
          "percentValue"
        ).innerText = `${percentComplete}%`;
      }
    };
    xhr.onload = function () {
      if (xhr.status === 201) {
        fetchFile();
        toastr.success("File successfully uploaded");
      } else {
        console.log("Error:", JSON.parse(xhr.responseText).message);
        toastr.error("Try again");
      }
    };

    xhr.onerror = function () {
      console.error("Upload failed.");
      toastr.error("Try again");
    };

    xhr.send(formData);
  }

  // Upload files
  async function uploadFile(e) {
    e.stopPropagation();
    e.preventDefault();
    document.getElementById("progressForm").style.display = "block";

    const fileInput = document.getElementById("uploadFile");
    const file = fileInput.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const newQuota = quota + fileSize;

    if (fileSize > 25 * (1024 * 1024)) {
      toastr.error("Max upload upto 25 MB");
      return console.log("Max upload upto 500 MB");
    } else if (role == "user" && newQuota > 50 * (1024 * 1024)) {
      toastr.error("Your quota is full use premium");
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full use premium");
    } else if (role == "premium" && newQuota > 150 * (1024 * 1024)) {
      toastr.error("Your quota is full");
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full");
    }

    const formData = new FormData();
    formData.append("size", fileSize);
    formData.append("path", "/");
    formData.append("email", email);
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${domain}/api/file/upload-folder`, true);
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        document.getElementById("fileName").innerText = fileName;
        document.getElementById("fileSize").innerText = `${(
          fileSize /
          (1024 * 1024)
        ).toFixed(2)} MB`;
        document.getElementById(
          "percentBar"
        ).style.width = `${percentComplete}%`;
        document.getElementById(
          "percentValue"
        ).innerText = `${percentComplete}%`;
      }
    };
    xhr.onload = function () {
      if (xhr.status === 201) {
        fetchFile();
        toastr.success("File successfully uploaded");
      } else {
        console.log("Error:", JSON.parse(xhr.responseText).message);
        toastr.error("Try again");
      }
    };

    xhr.onerror = function () {
      console.error("Upload failed.");
      toastr.error("Try again");
    };

    xhr.send(formData);
  }

  // Fetch files and folders
  async function fetchFile() {
    try {
      const email = localStorage.getItem("email");
      const firstName = localStorage.getItem("firstName");
      const lastName = localStorage.getItem("lastName");
      const response = await fetch(`${domain}/api/file/get-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "/",
          email: email,
        }),
      });

      const data = await response.json();
      const tableBody = document.querySelector("#fileInfo tbody");
      tableBody.innerHTML = "";
      document.getElementById("emptyFolder").style.display = "none";

      if (data.message == "Empty folder") {
        document.getElementById("emptyFolder").style.display = "block";
      } else {
        for (let i in data) {
          const row = document.createElement("tr");
          row.classList.add(
            "hover:bg-gray-50",
            "text-gray-900",
            "font-medium",
            "border-b",
            "border-gray-300"
          );

          const nameCell = document.createElement("td");
          nameCell.classList.add("px-6", "py-4", "text-start");
          if (data[i].type == "folder") {
            nameCell.innerHTML = `<a href='files.html?path=/${data[i].name}' id="folder"><div class="flex flex-row items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                  </svg> &nbsp; &nbsp; ${data[i].name}
                                </div></a>`;
          } else {
            nameCell.innerHTML = `<div class="flex flex-row items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                  </svg>
                                  &nbsp; &nbsp; ${data[i].name}
                                </div>`;
          }

          const typeCell = document.createElement("td");
          typeCell.classList.add("px-6", "py-4", "text-start");
          if (data[i].type == "folder") {
            typeCell.innerHTML = `<div class="flex flex-row items-center">FileFolder</div>`;
          } else {
            typeCell.innerHTML = `<div class="flex flex-row items-center">${data[i].fileType}</div>`;
          }

          const dateObj = new Date(data[i].date);
          var year = dateObj.getFullYear();
          const month = dateObj.toLocaleString("default", { month: "short" });
          var date = dateObj.getDate();
          const dateCell = document.createElement("td");
          dateCell.classList.add("px-6", "py-4", "text-start");
          dateCell.textContent = `${month} ${date}, ${year}`;

          const uploadByCell = document.createElement("td");
          uploadByCell.classList.add("px-6", "py-4", "text-start");
          uploadByCell.textContent = `${firstName} ${lastName}`;

          row.appendChild(nameCell);
          row.appendChild(typeCell);
          row.appendChild(dateCell);
          row.appendChild(uploadByCell);

          tableBody.appendChild(row);
        }
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
});
