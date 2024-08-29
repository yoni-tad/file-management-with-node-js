async function uploadFile(e) {
  e.preventDefault();

  console.log("upload clicked");

  const file = document.getElementById("uploadFile");
  const formData = new FormData();
  formData.append("file", file.files[0])

  const response = await fetch("http://localhost:3000/api/file/upload-folder", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Success: " + data.message);
  } else {
    console.log("Error: " + data.message);
  }
}

document.getElementById("upload").addEventListener("click", uploadFile);
