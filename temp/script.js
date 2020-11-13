let dropArea = document.getElementById("drop-area");
let fileForStaging = null;
const instanceAxios = axios.create({
  timeout: 8000,
});
const reqListener = (method, url, data, progress) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImI1MTgwNTRAaWlpdC1iaC5hYy5pbiIsImlhdCI6MTYwNTMwMDM1MywiZXhwIjoxNjA1OTA1MTUzLCJpc3MiOiJhY2NvdW50cy5ndXB0YS5jb20ifQ.wAjwrrvtrDxjhSLyXOKJjxwTI5sWzzHSVtJ8dsqVtmg",
      },
      onUploadProgress: function (progressEvent) {
        const { total, loaded } = progressEvent;
        progress = (loaded / total) * 100;
        renderProgress(progress);
      },
    })
      .then((res) => {
        // console.log(res.data);
        resolve({
          success: res.data,
        });
      })
      .catch((err) => {
        // console.log(err.response.data);
        resolve({
          err: err.response.data,
        });
      });
  });
};
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("active");
}
function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  fileForStaging = null;
  files = [...files];
  // console.log(files);
  fileForStaging = files[0];
  previewFile(fileForStaging);
}

function previewFile(file) {
  document.getElementById("gallery").innerHTML = "";
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("gallery").appendChild(img);
  };
}

const renderProgress = (val) => {
  document.getElementById("process_percentage").innerText = val + "%";
};

const uploadFile = async (file) => {
  let progress;
  const formData = new FormData();
  formData.append("file", file);
  // console.log(formData);
  const { success, err } = await reqListener(
    "POST",
    "/api/upload/image",
    formData,
    progress
  );
  console.log(success, err);
};
