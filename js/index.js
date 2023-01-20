$(document).ready(function(){

    elementArray = $(".e-zipform__selectors").children()
    elementArray.each(function (i, el) {
        el.addEventListener("click", function () {
            elementArray.removeClass("-active"), 
            el.classList.add("-active"), 
            0 === i ? $(".e-cartoons__wrapper").addClass("-family") : $(".e-cartoons__wrapper").removeClass("-family");
        });
    })


    $(".e-revealer__toggle").click(function() {
        $(".e-revealer__content").addClass("-active")
    })

    $(".e-exitBox__exitButton ").click(function() {
        $(".e-revealer__content").removeClass("-active");
    })

    $(".gender-radio").click(function () {
        $(".gender-radio").removeClass("-isSet");
        $(this).addClass("-isSet");   
    });

    $(".smoke-radio").click(function () {
        $(".smoke-radio").removeClass("-isSet");
        $(this).addClass("-isSet");   
    });

    $(".pregnant-radio").click(function () {
        $(".pregnant-radio").removeClass("-isSet");
        $(this).addClass("-isSet");   
    });


    $('.button__submit').click(function() {
        next($(event.target).parent().parent().parent())
        
    })

    $('.continueBtn').click(function() {

        const ft  = $('#form-height-feet').val();
        const In  = $('#form-height-inches').val();
        const mo  = $('#form-dob-month').val();
        const day = $('#form-dob-day').val();
        const yr  = $('#form-dob-year').val();
        const lbs = $('#form-weight').val();

        if(!ft && !In){
            $('.height-error').fadeIn()
            setTimeout(() => $('.height-error').fadeOut(), 2000)
        }else if(!mo && !day && !yr){
            $('.bday-error').fadeIn()
            setTimeout(() => $('.bday-error').fadeOut(), 2000)
        }else if(!lbs){
            $('.weight-error').fadeIn()
            setTimeout(() => $('.weight-error').fadeOut(), 2000)
        }else{
            $('.status-bar').css('width', '85%');
            $('.status-progress').text('85% Complete');
            next($(event.target).parent().parent().parent().parent().parent().parent())
        }


        
    })

    $('.nextStepLast').click(function() {
        $('.status-bar').css('width', '95%');
        $('.status-progress').text('95% Complete');
        next($(event.target).parent().parent().parent().parent().parent())
    })

    $('.prevStep1').click(function() {
        var parent = $(this).parent().parent().parent().parent().parent().parent();
        parent.fadeOut()
        parent.prev().fadeIn();
        $('.status-bar').css('width', '75%');
        $('.status-progress').text('75% Complete');
    })

    $('.prevStep2').click(function() {
        var parent = $(this).parent().parent().parent().parent().parent();
        parent.fadeOut()
        parent.prev().fadeIn();
        $('.status-bar').css('width', '85%');
        $('.status-progress').text('85% Complete');
    })

    $('.lastSteps').click(function() {
        var parent = $(this).parent().parent().parent().parent().parent();
        parent.fadeOut()
        parent.prev().fadeIn();
    })

    $('.getQuoteBtn').click(function(e){
      
      e.preventDefault();

      const fname   = $('#form-firstname').val();
      const lname   = $('#form-register--last-name').val();
      const address = $('#form-address').val();
      const phone   = $('#form-register--phone-number').val();
      const email   = $('#form-email').val();
      const zip     = $('#form-zip-code').val();

      var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var width = 0;

      if(!fname){
        $('.fNameError').fadeIn();
        setTimeout(()=>  $('.fNameError').fadeOut(), 2000);
      }else if(!lname){
        $('.lNameError').fadeIn();
         setTimeout(()=>  $('.lNameError').fadeOut(), 2000);
      }else if(!address){
        $('.addressError').fadeIn();
         setTimeout(()=>  $('.addressError').fadeOut(), 2000);
      }else if(!zip){
        $('.zipError').fadeIn();
         setTimeout(()=>  $('.zipError').fadeOut(), 2000);
      }else if(!phone){
         $('.phoneError').fadeIn();
         setTimeout(()=>  $('.phoneError').fadeOut(), 2000);
      }else if(!email || !regex.test(email)){
          $('.emailError').fadeIn();
          setTimeout(()=>  $('.emailError').fadeOut(), 2000);
      }else{

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxVHbNBqQnGlVKFgG72edY23DZ0WLJswqVBPnLTtW5kFEP_l__ajw2WgDJx_H0opp4A/exec'
        const form = document.forms['submit-to-google-sheet']

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => console.log('Success!'))
            .catch(error => console.error('Error!', error.message))


        $('.loading_overlay').css('display', 'flex')
        $('.form_name').text(fname);

          
        var id = setInterval(frame, 40);
        function frame() {
          if (width >= 100) {
            setTimeout(() => {
              $('#funnel-form').fadeOut()
              setTimeout(() => $('#thankYou').fadeIn(), 500);
            }, 500)
          } else {
            width++; 
            $('#barStatus').css('width', width + '%'); 
          }
        }


      }
    })

    
    function next(parent) {
        var next = parent.next();

        parent.fadeOut(function() {
            if (next.length) {
                next.fadeIn();
                return;
            }
        });
    }


})

$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 100) {
    $('#sticky-cta').slideDown();
  } else {
    $('#sticky-cta').slideUp();
  }
});



