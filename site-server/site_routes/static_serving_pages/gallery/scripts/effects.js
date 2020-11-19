const instanceAxios = axios.create({
  timeout: 8000,
});

const reqListener = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
      headers: {
        Authorization: "Bearer " + getToken("access_token"),
      },
    })
      .then((res) => {
        // console.log(res.data);
        resolve({
          success: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        resolve({
          err: err.response.data,
        });
      });
  });
};

const getToken = (key) => {
  const tokenFromStorage = localStorage.getItem("access_token");
  var name = key + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return tokenFromStorage;
};

const loadUser = async () => {
  const token = getToken("access_token");
  if (token) {
    const { success, err } = await reqListener("get", "/api/");
    if (success && success.success == true) {
      console.log(success);
      document.getElementById("login-btn").style.display = "none";
      document.getElementById("avatar-div").style.display = "flex";
    } else {
      console.log("invalid token");
    }
  } else {
    console.log("no session token found");
  }
};

const getAllObjects = async () => {
  const token = getToken("access_token");
  if (token) {
    const { success, err } = await reqListener(
      "GET",
      "/api/library/allObjects"
    );
    if (success && success.success) {
      console.log(success.data);
    }
  } else {
    location.href = "/signin";
  }
};

loadUser();
