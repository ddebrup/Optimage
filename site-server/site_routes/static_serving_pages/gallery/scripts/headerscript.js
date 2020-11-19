window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "5px 10px";
    document.getElementById("navbar").style.opacity = "0.8";
  } else {
    document.getElementById("navbar").style.padding = "15px 10px";
    document.getElementById("navbar").style.opacity = "1";
  }
  document.getElementsByClassName("content")[0].style.marginTop =
    document.getElementById("navbar").offsetHeight + "px";
}

function ResponsiveFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
document.getElementsByClassName("content")[0].style.marginTop =
  document.getElementById("navbar").offsetHeight + "px";

let avatarDropOpen = false;

const avatarDrop = () => {
  if (!avatarDropOpen) {
    document.getElementById("drop-selection").style.display = "flex";
    avatarDropOpen = true;
  } else {
    document.getElementById("drop-selection").style.display = "none";
    avatarDropOpen = false;
  }
};
