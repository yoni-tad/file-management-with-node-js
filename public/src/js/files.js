document.addEventListener("DOMContentLoaded", async () => {
  const domain = "http://localhost:3000";
  const token = localStorage.getItem("token");
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const pathValue = params.get("path");
  var path = pathValue == null ? "/" : `${pathValue}/`;
  if (pathValue != "/") {
    var l = "";
    path.split("/").forEach((item) => {
      l = `${l + item}/`;
      const pathDir = document.getElementById("pathDir");
      const list = document.createElement("a");
      list.href = `files.html?path=/${l
        .replace("/", "")
        .substring(0, l.replace("/", "").length - 1)}`;
      list.textContent = `/${item}`;
      pathDir.appendChild(list);
    });
  } else {
    path = "/";
  }

  fetchFiles(path);
  checkUser();
  create(path);
  document.getElementById("fileUpload").onchange = function (event) {
    fileUpload(event, path);
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

  function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + "&hellip;" : str;
  }

  // Fetch folders and files
  async function fetchFiles(path) {
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
          path: path,
          email: email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const tableBody = document.querySelector("#example tbody");
        tableBody.innerHTML = "";
        for (let i in data) {
          const row = document.createElement("tr");
          const nameCell = document.createElement("td");

          if (data[i].type == "folder") {
            nameCell.innerHTML = `<a href='files.html?path=${path}${
              data[i].name
            }' id="folder"><div class="flex flex-row items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                  </svg> &nbsp; &nbsp; ${truncate(
                                    data[i].name,
                                    30
                                  )}
                                </div></a>`;
          } else {
            nameCell.innerHTML = `<div class="flex flex-row items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                  </svg>
                                  &nbsp; &nbsp; ${truncate(data[i].name, 30)}
                                </div>`;
          }

          const dateObj = new Date(data[i].date);
          var year = dateObj.getFullYear();
          const month = dateObj.toLocaleString("default", { month: "short" });
          var date = dateObj.getDate();
          const dateCell = document.createElement("td");
          dateCell.textContent = `${month} ${date}, ${year}`;

          const uploadByCell = document.createElement("td");
          uploadByCell.classList.add("px-6", "py-4", "text-start");
          uploadByCell.textContent = `${firstName} ${lastName}`;

          const actionCell = document.createElement("td");
          if (data[i].type == "folder") {
            actionCell.innerHTML = `<div class="flex justify-end space-x-2">
            <button data-id=${data[i].id} data-value=${data[i].name}
                class="flex items-center px-4 py-1 border border-gray-800 rounded-lg hover:border-blue-400 relative group renameFolderBtn">
                <svg class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                <span
                    class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">Rename</span>
            </button>
            <button data-id=${data[i].id} id="deleteFolderBtn"
                class="flex items-center px-4 py-1 border border-gray-800 rounded-lg hover:border-red-400 relative group deleteFolderBtn">
                <svg class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                <span
                    class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">Delete</span>
            </button>
        </div>`;
          } else {
            actionCell.innerHTML = `<div class="flex justify-end space-x-2">
                              <button data-id=${data[i].id} 
                                  class="flex items-center px-4 py-1 border border-gray-800 rounded-lg hover:border-green-400 relative group downloadFile">
                                  <svg class="w-4 h-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none" viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor">
                                      <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                  </svg>
                                  <span
                                      class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">Download</span>
                              </button>
                              <button data-id=${data[i].id} data-value=${data[i].name}
                                  class="flex items-center px-4 py-1 border border-gray-800 rounded-lg hover:border-blue-400 relative group renameFileBtn">
                                  <svg class="w-4 h-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none" viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor">
                                      <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                  </svg>
                                  <span
                                      class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">Edit</span>
                              </button>
                              <button data-id=${data[i].id} 
                                  class="flex items-center px-4 py-1 border border-gray-800 rounded-lg hover:border-red-400 relative group deleteFileBtn">
                                  <svg class="w-4 h-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none" viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="currentColor">
                                      <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                  <span
                                      class="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded">Delete</span>
                              </button>
                          </div>`;
          }

          row.appendChild(nameCell);
          row.appendChild(dateCell);
          row.appendChild(uploadByCell);
          row.appendChild(actionCell);

          tableBody.appendChild(row);
        }
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
    new DataTable("#example");
  }

  // create folder
  function create(path) {
    document.getElementById("newFolder").addEventListener("click", function () {
      document.getElementById("newFolderModal").style.display = "block";
    });
    document
      .getElementById("createFolder")
      .addEventListener("click", function () {
        const folderName = document.getElementById("folderName").value;
        if (folderName == null) return;
        createFolder(path, folderName);
        document.getElementById("folderName").value = "";
        document.getElementById("newFolderModal").style.display = "none";
      });
  }

  // Create folder
  async function createFolder(path, name) {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(`${domain}/api/file/create-folder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: path,
          name: name,
          email: email,
        }),
      });

      if (response.ok) {
        console.log("Folder created");
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
    fetchFiles(path);
  }

  // file upload
  async function fileUpload(e, path) {
    e.preventDefault();
    document.getElementById("progressForm").style.display = "block";
    const email = localStorage.getItem("email");
    const quota = localStorage.getItem("quota");

    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];
    const fileName = file.name;
    const fileSize = file.size;
    const newQuota = parseInt(quota) + fileSize;

    if (fileSize > 524288000) {
      return console.log("Max upload upto 500 MB");
    } else if (role == "user" && newQuota > 52428800) {
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full use premium" + newQuota);
    } else if (role == "premium" && newQuota > 157286400) {
      document.getElementById("progressForm").style.display = "none";
      document.getElementById("subscribeAlert").style.display = "block";
      return console.log("Your quota is full");
    }

    const formData = new FormData();
    formData.append("size", fileSize);
    formData.append("path", path);
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
        fetchFiles(path);
      } else {
        console.log("Error:", JSON.parse(xhr.responseText).message);
      }
    };
    xhr.onerror = function () {
      console.error("Upload failed.");
    };
    xhr.send(formData);
  }

  
  // Delete and edit handler
  document.querySelector("#example tbody").addEventListener("click", (e) => {
    if (e.target.classList.contains("renameFolderBtn")) {
      const id = e.target.getAttribute("data-id");
      const folderName = e.target.getAttribute("data-value");
      document.getElementById('editFolderModal').style.display = 'block'
      document.getElementById('renameFolder').value = folderName
      const deleteModalBtn = document.getElementById("renameFolderSave");
      deleteModalBtn.setAttribute("data-id", id);
    } else if (e.target.classList.contains("renameFileBtn")) {
      const id = e.target.getAttribute("data-id");
      const fileName = e.target.getAttribute("data-value");
      document.getElementById('editFileModal').style.display = 'block'
      document.getElementById('renameFile').value = fileName
      const deleteModalBtn = document.getElementById("renameFileSave");
      deleteModalBtn.setAttribute("data-id", id);
    } else if (e.target.classList.contains("deleteFolderBtn")) {
      const id = e.target.getAttribute("data-id");
      document.getElementById("deleteModal").style.display = "block";
      const deleteModalBtn = document.getElementById("deleteModalBtn");
      deleteModalBtn.setAttribute("data-id", id);
    } else if (e.target.classList.contains("deleteFileBtn")) {
      const id = e.target.getAttribute("data-id");
      document.getElementById("deleteFileModal").style.display = "block";
      const deleteModalBtn = document.getElementById("deleteFileModalBtn");
      deleteModalBtn.setAttribute("data-id", id);
    } else if (e.target.classList.contains("downloadFile")) {
      const id = e.target.getAttribute("data-id");
      downloadFile(id)
    } 
  });

  //  Rename folder
  document.getElementById("renameFolderSave").addEventListener('click', (e) => {
    const id = e.target.getAttribute("data-id");
    const rename = document.getElementById('renameFolder').value
    if(rename == null) return
    renameFolder(id, rename)
  })

  async function renameFolder(id, name) {
    try {
      const response = await fetch(`${domain}/api/file/rename-folder`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          name: name
        })
      });

      if (response.ok) {
        console.log("Folder renamed");
        window.location.href = "files.html";
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  //  Rename file
  document.getElementById("renameFileSave").addEventListener('click', (e) => {
    const id = e.target.getAttribute("data-id");
    const rename = document.getElementById('renameFile').value
    if(rename == null) return
    renameFile(id, rename)
  })

  async function renameFile(id, name) {
    try {
      const response = await fetch(`${domain}/api/file/rename-file`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          name: name
        })
      });

      if (response.ok) {
        console.log("File renamed");
        window.location.href = "files.html";
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  // Delete folder
  document.getElementById("deleteModalBtn").addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    deleteFolder(id);
  });

  async function deleteFolder(id) {
    try {
      const response = await fetch(`${domain}/api/file/delete-folder/${id}`);

      if (response.ok) {
        console.log("Folder deleted");
        window.location.href = "files.html";
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  // Delete file
  document.getElementById("deleteFileModalBtn").addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id");
    deleteFile(id);
  });

  async function deleteFile(id) {
    try {
      const response = await fetch(`${domain}/api/file/delete-file/${id}`);

      if (response.ok) {
        console.log("File deleted");
        window.location.href = "files.html";
      }
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }

  // Download file
  async function downloadFile(id) {
    try {
      const response = await fetch(`${domain}/api/file/download-file/${id}`);
      window.location.href = `${domain}/api/file/download-file/${id}`
    } catch (e) {
      console.log(`Error: ${e}`);
    }    
  }
});
