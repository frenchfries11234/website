$(document).ready(function () {
    var navbar = $('.navbar');

    $(window).scroll(function () {
      var scrollPos = $(this).scrollTop();

      if (scrollPos > window.innerHeight*.75) {
        navbar.addClass('visible');
      } else {
        navbar.removeClass('visible');
      }
    });
  });

$(document).ready(function () {
    var windowHeight = $(window).height();
  
    $(window).scroll(function () {
      var scrollPos = $(this).scrollTop();
  
      $('.animated').each(function () {
        var offsetTop = $(this).offset().top;
        var elementHeight = $(this).outerHeight();
  
        if (scrollPos + windowHeight > offsetTop && scrollPos < offsetTop + elementHeight) {
          $(this).addClass('animate-in');
        } else {
          $(this).removeClass('animate-in');
        }
      });
    });
  });
  

  $(document).ready(function () {
    $(window).scroll(function () {
      var scrollTop = $(this).scrollTop();
      var opacity = 1 - (scrollTop / 400); // Adjust the division value to control the fading speed
    //   var headDiv = document.querySelector('.intro');
    //   headDiv.style.opacity = opacity;
    $('h1').css('opacity', opacity);

    });
  });
  
