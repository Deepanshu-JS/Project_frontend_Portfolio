var timeout;
const scroll = new LocomotiveScroll({
  el: document.querySelector(".main"),
  smooth: true,
});

//   mouse circle
function circleMouseFollower(xscale = 1, yscale = 1) {
  window.addEventListener("mousemove", function (dets) {
    document.querySelector(
      "#minicircle"
    ).style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale}, ${yscale})`;
  });
}

circleMouseFollower();

// hero section text animation

function firstPageAnim() {
  var tl = gsap.timeline();

  tl.from(".nav", {
    y: "-10",
    opacity: 0,
    delay: 6,
    duration: 1.5,
    ease: Expo.easeInOut,
  })
    .to(".boundingelem", {
      y: 0,
      ease: Expo.easeInOut,
      duration: 2,
      delay: -1,
      stagger: 0.2,
    })
    .from(".heroFooter", {
      y: -10,
      opacity: 0,
      duration: 1.5,
      delay: -1,
      ease: Expo.easeInOut,
    });
}

// define default scale value
function circleChaptaKaro() {
  var xscale = 1;
  var yscale = 1;

  var xprev = 0;
  var yprev = 0;

  window.addEventListener("mousemove", function (dets) {
    clearTimeout(timeout);

    xscale = gsap.utils.clamp(0.8, 1.2, dets.clientX - xprev);
    yscale = gsap.utils.clamp(0.8, 1.2, dets.clientY - yprev);

    xprev = dets.clientX;
    yprev = dets.clientY;

    circleMouseFollower(xscale, yscale);

    timeout = setTimeout(function () {
      document.querySelector(
        "#minicircle"
      ).style.transform = `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;
    }, 100);
  });
}
// Time function
function updateTime() {
  var currentTime = new Date();
  var options = { hour12: true, hour: "numeric", minute: "numeric" };
  var formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    currentTime
  );

  // Display the time in the HTML element
  document.getElementById("current-time").innerHTML = formattedTime;
}

// Call updateTime once to display the initial time
updateTime();
setInterval(updateTime, 1000);

firstPageAnim();
circleChaptaKaro();

// hover wala animation
document.querySelectorAll(".elem").forEach(function (elem) {
  var rotate = 0;
  var diffrot = 0;

  elem.addEventListener("mouseleave", function (dets) {
    gsap.to(elem.querySelector("img"), {
      opacity: 0,
      ease: Power3,
      duration: 0.5,
    });
  });

  elem.addEventListener("mousemove", function (dets) {
    var diff = dets.clientY - elem.getBoundingClientRect().top;
    diffrot = dets.clientX - rotate;
    rotate = dets.clientX;
    gsap.to(elem.querySelector("img"), {
      opacity: 1,
      ease: Power4,
      top: diff,
      left: dets.clientX,
      rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
    });
  });
});

// preloader
const tl2 = gsap.timeline();

tl2
  .to("body", {
    overflow: "hidden",
  })
  .to(".preloader .text-container", {
    duration: 0,
    opacity: 1,
    ease: "Power3.easeOut",
  })
  .from(".preloader .text-container h1", {
    duration: 2.5,
    delay: 1,
    y: 70,
    skewY: 10,
    stagger: 0.4,
    ease: "Power3.easeOut",
  })
  .to(".preloader .text-container h1", {
    duration: 2.2,
    y: 70,
    skewY: -20,
    stagger: 0.2,
    ease: "Power3.easeOut",
  })
  .to(".preloader", {
    duration: 1.5,
    height: "0vh",
    ease: "Power3.easeOut",
  })
  .to(
    "body",
    {
      overflow: "hidden",
    },
    "-=2"
  )
  .to(".preloader", {
    display: "none",
  });

/*click image and redirect to page whatever you want*/

document.querySelectorAll(".elem").forEach(function (elem) {
  var rotate = 0;
  var diffrot = 0;

  elem.addEventListener("mouseleave", function () {
    gsap.to(elem.querySelector("img"), {
      opacity: 0,
      ease: "Power3",
      duration: 0.5,
    });
  });

  elem.addEventListener("mousemove", function (dets) {
    var diff = dets.clientY - elem.getBoundingClientRect().top;
    diffrot = dets.clientX - rotate;
    rotate = dets.clientX;
    var img = elem.querySelector("img");

    gsap.to(elem.querySelector("img"), {
      opacity: 1,
      ease: Power4,
      top: diff,
      left: dets.clientX,
      rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
    });

    var link = elem.getAttribute("data-href");
    if (link) {
      elem.style.cursor = "pointer";
      elem.addEventListener("click", function () {
        window.open(link, "_blank"); // Open link in a new tab
      });
    }
  });
});

scroll.init();

// To disable Locomotive Scroll and hide scrollbar
function disableLocomotiveScroll() {
  scroll.destroy();
  document.body.classList.remove("main");
}

// To enable Locomotive Scroll and show scrollbar
function enableLocomotiveScroll() {
  scroll.init();
  document.body.classList.add("main");
}


