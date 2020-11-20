let dropArea = document.getElementById("drop-area");
let fileForStaging = null;
let imageUniqueId, current_image_width, current_image_height;

const reqListenerUpload = (method, url, data, progress) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + getToken("access_token"),
      },
      onUploadProgress: function (progressEvent) {
        const { total, loaded } = progressEvent;
        progress = (loaded / total) * 100;
        // renderProgress(progress);
      },
    })
      .then((res) => {
        resolve({
          success: res.data,
        });
      })
      .catch((err) => {
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
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    img = document.getElementById("preview-image");
    img.src = reader.result;
    document.getElementById("optimisation-section").style.display = "flex";
    document.getElementById("no-image").style.display = "none";
    let scrollLength =
      document.getElementById("optimisation-section").offsetTop - 70;
    while (1) {
      if (scrollLength > 0) {
        setTimeout(() => {
          window.scrollBy(0, 1);
        }, 100);
        scrollLength = scrollLength - 1;
      } else {
        break;
      }
    }
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
  const { success, err } = await reqListenerUpload(
    "POST",
    "/api/upload/image",
    formData,
    progress
  );
  console.log(success, err);
  if (success && success.success) {
    imageUniqueId = success.unique_id;
  }
};
const reqListenerDownload = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      params: data,
      headers: {
        Authorization: "Bearer " + getToken("access_token"),
      },
      responseType: "blob",
    })
      .then((res) => {
        resolve({
          data: res.data,
          success: true,
        });
      })
      .catch((err) => {
        resolve({
          err: err.response.data,
        });
      });
  });
};
const downloadFile = async (fileName) => {
  const { success, err, data } = await reqListenerDownload(
    "GET",
    "/api/download/",
    {
      filename: fileName,
    }
  );
  if (success) {
    const download = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = download;
    link.setAttribute("download", fileName);
    link.click();
    link.remove();
  } else {
    console.log("not found");
  }
};

document.getElementById("drop-area").addEventListener("click", (e) => {
  document.getElementById("fileUploadBtn").click();
});
