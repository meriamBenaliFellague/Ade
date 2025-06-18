let navbar = document.querySelector('.header .navbar');
let searchForm = document.querySelector('.header .search-form');
let loginForm = document.querySelector('.header .login-form');
let contactInfo = document.querySelector('.contact-info');

document.querySelector('#menu-btn').onclick = () =>{
   navbar.classList.toggle('active');
   searchForm.classList.remove('active');
   loginForm.classList.remove('active');
};

document.querySelector('#search-btn').onclick = () =>{
   searchForm.classList.toggle('active');
   navbar.classList.remove('active');
   loginForm.classList.remove('active');
};

document.querySelector('#login-btn').onclick = () =>{
   navbar.classList.remove('active');
   searchForm.classList.remove('active'); 
   window.location.href = "/Home/LoginAdmin";
};


// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // The lower the slower
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const count = parseInt(counter.innerText) || 0;
    const increment = Math.ceil(target / speed);
    
    if (count < target) {
      counter.innerText = Math.min(count + increment, target);
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}

document.querySelector('#info-btn').onclick = () => {
  contactInfo.classList.add('active');
  document.body.classList.add('contact-info-active');
};

// Animate elements when they come into view
document.addEventListener('DOMContentLoaded', function() {
  // Start counter animation when about section is in view
  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate counters
          animateCounters();
          
          // Animate boxes
          const boxes = document.querySelectorAll('.about .box');
          boxes.forEach((box, index) => {
            setTimeout(() => {
              box.style.opacity = '1';
              box.style.transform = 'translateY(0)';
            }, index * 150);
          });
          
          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(aboutSection);
  }
});

document.querySelector('#close-contact-info').onclick = () =>{
   contactInfo.classList.remove('active');
   document.body.classList.remove('contact-info-active');
}

window.onscroll = () =>{
   navbar.classList.remove('active');
   searchForm.classList.remove('active');
   contactInfo.classList.remove('active');
   document.body.classList.remove('contact-info-active');
}

var swiper = new Swiper(".home-slider", {
   loop:true,
   grabCursor:true,
   navigation: {
     nextEl: ".swiper-button-next",
     prevEl: ".swiper-button-prev",
   },
});

var reviewsSwiper = new Swiper(".reviews-slider", {
   loop: true,
   loopFillGroupWithBlank: true,
   grabCursor: true,
   spaceBetween: 20,
   slidesPerView: 3,
   centeredSlides: true,
   navigation: {
     nextEl: ".reviews .swiper-button-next",
     prevEl: ".reviews .swiper-button-prev",
   },
   breakpoints: {
     320: {
       slidesPerView: 1,
       slidesPerGroup: 1,
     },
     640: {
       slidesPerView: 1,
       slidesPerGroup: 1,
     },
     768: {
       slidesPerView: 2,
       slidesPerGroup: 2,
     },
     991: {
       slidesPerView: 3,
       slidesPerGroup: 3,
     },
   },
});

var swiper = new Swiper(".blogs-slider", {
   loop:true,
   grabCursor:true,
   spaceBetween: 20,
   navigation: {
     nextEl: ".blogs .swiper-button-next",
     prevEl: ".blogs .swiper-button-prev",
   },
   breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      991: {
        slidesPerView: 3,
      },
   },
});

var swiper = new Swiper(".logo-slider", {
   loop:true,
   grabCursor:true,
   spaceBetween: 20,
   breakpoints: {
      450: {
         slidesPerView: 2,
       },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      1000: {
        slidesPerView: 5,
      },
   },
});