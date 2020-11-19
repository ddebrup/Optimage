const reqListenerResize = (method, url, data) => {
  return new Promise((resolve, reject) => {
    instanceAxios({
      method: method,
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImI1MTgwNTRAaWlpdC1iaC5hYy5pbiIsImlhdCI6MTYwNTMwMDM1MywiZXhwIjoxNjA1OTA1MTUzLCJpc3MiOiJhY2NvdW50cy5ndXB0YS5jb20ifQ.wAjwrrvtrDxjhSLyXOKJjxwTI5sWzzHSVtJ8dsqVtmg",
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

var resizeableImage = function (image_target) {
  //here i declared the global interferes
  var $container,
    orig_src = new Image(),
    image_target = $(image_target).get(0),
    event_state = {},
    constrain = false,
    min_width = 60,
    min_height = 60,
    max_width = 800,
    max_height = 800,
    resize_canvas = document.createElement("canvas");
  orig_src.addEventListener("load", function () {
    console.log(this.width, this.height);
    resizeImage(400, 400);
  });
  init = function () {
    orig_src.src = image_target.src;
    $(image_target)
      .wrap('<div class="resize-container"></div>')
      .before('<span class="resize-handle resize-handle-nw"></span>')
      .before('<span class="resize-handle resize-handle-ne"></span>')
      .after('<span class="resize-handle resize-handle-se"></span>')
      .after('<span class="resize-handle resize-handle-sw"></span>');

    $container = $(image_target).parent(".resize-container");

    // Add events
    $container.on("mousedown touchstart", ".resize-handle", startResize);
    $container.on("mousedown touchstart", "img", startMoving);
  };

  startResize = function (e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on("mousemove touchmove", resizing);
    $(document).on("mouseup touchend", endResize);
  };

  endResize = function (e) {
    e.preventDefault();
    $(document).off("mouseup touchend", endResize);
    $(document).off("mousemove touchmove", resizing);
  };

  saveEventState = function (e) {
    // Save the state of events
    event_state.container_width = $container.width();
    event_state.container_height = $container.height();
    event_state.container_left = $container.offset().left;
    event_state.container_top = $container.offset().top;
    event_state.mouse_x =
      (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
      $(window).scrollLeft();
    event_state.mouse_y =
      (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
      $(window).scrollTop();

    if (typeof e.originalEvent.touches !== "undefined") {
      event_state.touches = [];
      $.each(e.originalEvent.touches, function (i, ob) {
        event_state.touches[i] = {};
        event_state.touches[i].clientX = 0 + ob.clientX;
        event_state.touches[i].clientY = 0 + ob.clientY;
      });
    }
    event_state.evnt = e;
  };

  resizing = function (e) {
    var mouse = {},
      width,
      height,
      left,
      top,
      offset = $container.offset();
    mouse.x =
      (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) +
      $(window).scrollLeft();
    mouse.y =
      (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) +
      $(window).scrollTop();

    if ($(event_state.evnt.target).hasClass("resize-handle-se")) {
      width = mouse.x - event_state.container_left;
      height = mouse.y - event_state.container_top;
      left = event_state.container_left;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass("resize-handle-sw")) {
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height = mouse.y - event_state.container_top;
      left = mouse.x;
      top = event_state.container_top;
    } else if ($(event_state.evnt.target).hasClass("resize-handle-nw")) {
      width =
        event_state.container_width - (mouse.x - event_state.container_left);
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = mouse.x;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width) * orig_src.height - height);
      }
    } else if ($(event_state.evnt.target).hasClass("resize-handle-ne")) {
      width = mouse.x - event_state.container_left;
      height =
        event_state.container_height - (mouse.y - event_state.container_top);
      left = event_state.container_left;
      top = mouse.y;
      if (constrain || e.shiftKey) {
        top = mouse.y - ((width / orig_src.width) * orig_src.height - height);
      }
    }

    if (constrain || e.shiftKey) {
      height = (width / orig_src.width) * orig_src.height;
    }

    if (
      width > min_width &&
      height > min_height &&
      width < max_width &&
      height < max_height
    ) {
      resizeImage(width, height);
      $container.offset({ left: left, top: top });
    }
  };

  resizeImage = function (width, height) {
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext("2d").drawImage(orig_src, 0, 0, width, height);
    $(image_target).attr("src", resize_canvas.toDataURL("image/png"));
    current_image_height = height;
    current_image_width = width;
    console.log(current_image_width, current_image_height);
  };

  startMoving = function (e) {
    e.preventDefault();
    e.stopPropagation();
    saveEventState(e);
    $(document).on("mousemove touchmove", moving);
    $(document).on("mouseup touchend", endMoving);
  };

  endMoving = function (e) {
    e.preventDefault();
    $(document).off("mouseup touchend", endMoving);
    $(document).off("mousemove touchmove", moving);
  };

  moving = function (e) {
    var mouse = {},
      touches;
    e.preventDefault();
    e.stopPropagation();

    touches = e.originalEvent.touches;

    mouse.x =
      (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
    mouse.y =
      (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();
    $container.offset({
      left: mouse.x - (event_state.mouse_x - event_state.container_left),
      top: mouse.y - (event_state.mouse_y - event_state.container_top),
    });
    if (
      event_state.touches &&
      event_state.touches.length > 1 &&
      touches.length > 1
    ) {
      var width = event_state.container_width,
        height = event_state.container_height;
      var a = event_state.touches[0].clientX - event_state.touches[1].clientX;
      a = a * a;
      var b = event_state.touches[0].clientY - event_state.touches[1].clientY;
      b = b * b;
      var dist1 = Math.sqrt(a + b);

      a = e.originalEvent.touches[0].clientX - touches[1].clientX;
      a = a * a;
      b = e.originalEvent.touches[0].clientY - touches[1].clientY;
      b = b * b;
      var dist2 = Math.sqrt(a + b);

      var ratio = dist2 / dist1;

      width = width * ratio;
      height = height * ratio;
      resizeImage(width, height);
    }
  };

  init();
};

const initResize = () => {
  document.getElementById("resize-img").src = document.getElementById(
    "gallery"
  ).children[0].src;
  resizeableImage($(".resize-image"));
  document.getElementById("resize-container").style.display = "block";
};

const requestresize = async () => {
  if (imageUniqueId) {
    const data = {
      unique_id: imageUniqueId,
      width: current_image_width,
      height: current_image_height,
    };
    console.log(data);
    const { success, err } = await reqListenerResize(
      "POST",
      "/api/services/resize",
      data
    );
    console.log(success, err);
  } else {
    alert("upload image first and try again");
  }
};
