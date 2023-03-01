$(document).ready(function() {

    $('.stepbox .q-btn').click(next);


    $("#formFields").submit(next) ;

    $('#q2 .q-btn').click(function(){ 

        if (!interval) {
            interval = setInterval(startTimer, 1000);
        }
    });

    /*$('input[name=phone]').blur(function(e){
        var x = e.target.value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
        e.target.value = '(' + x[1] + ') ' + x[2] + '-' + x[3];
    });*/

    
    var $timer = $('.counter');
    var timer = 120;
    var interval = 0;

    function startTimer() {
        if (timer < 1) clearInterval(interval);

        var seconds = timer % 60;
        var s = seconds < 10 ? '0' + seconds : seconds;
        var m = '0' + Math.floor(timer / 60);

        $timer.text(m + ':' + s);

        timer--;
    };

    function working() {
        var self = $(this);
        var next = $(this).next('.popup');

        if (next.length) {
            setTimeout(function() {
                self.fadeOut(function() {
                    next.fadeIn(working);
                });
            }, 500);
        } else {
            $('.progress > span').text('100% Complete');
            $('.progress .bar span').css({ width: '100%' });
        }

        if (!interval) {
            interval = setInterval(startTimer, 1000);
        }
    }


    $steps = $('.stepbox');

    function next(e) {
        e.preventDefault();


        var parent = $(this).parents('.stepbox');
        var next = parent.next('.stepbox');

        $('.progress').css({ display: '' });


        if(e.target.className === 'form_wrap'){

            const scriptURL = 'https://script.google.com/macros/s/AKfycby_4UBmkF52Vy71A1Qnfqaq2AYehF5iObJkMCNNeRv9mlyRO645jx68RS4EC-xcyEADWw/exec'
            const form = document.forms['submit-to-google-sheet']

             if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('input[name=email]').val())){
                  alert("You have entered an invalid email address!")
                  return false;
              }

              fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(() => {

                    console.log('Success!')

                    var date = new Date();
                    var unixTimeStamp = Math.floor(date.getTime() / 1000);
                    var fname = $('input[name=name]').val();
                    var lname = $('input[name=lastname]').val();
                    var email = $('input[name=email]').val();
                    var phone = $('input[name=phone]').val();
                    
                    $('input[name=id]').val(fname);


                    _cio.identify({
                        // Required attributes 
                        id: fname+' '+lname,    // Use either id or email.
                        email: email,
                        
                        // Stringly recommended attributes
                        created_at: unixTimeStamp,   // Timestamp in your system that represents when
                                                  // the user first signed up. You'll want to send it
                                                  // as seconds since the epoch.

                        // Example attributes (you can name attributes what you wish)
                        first_name: fname,       // Add any attributes you'd like to use in the email subject or body.
                        last_name: lname,       // First name and last name are shown on people pages.
                        phone: phone,      
                        offer: 'aca' // To use the example segments, set this to 'free' or 'premium'.
                    });

                }).catch(error => console.error('Error!', error.message))

        }

        parent.fadeOut(function() {
            if (next.length) {
                next.fadeIn();

                if (next.data('progress')) {
                    var progress = parseInt(next.data('progress'));
                } else {
                    var progress = 100 / $steps.length * (next.index() - $steps.first().index());
                }

                $('.progress > span').text(Math.round(progress) + '% Complete');
                $('.progress .bar span').css({ width: progress + '%' });

                if ($('.progress > span').text() === '90% Complete') {
                    $('#skip').hide()
                }

                return;
            }

            $('.main .popup').first().fadeIn(working);
        });
    }


    $('input[name=phone]').mask('+19999999999');
      
    $('input[name=phone]').on('focus', function () {
        if ($(this).val().length === 0) {
           $(this).val('+1');
        }
    });
      
    $('input[name=phone]').keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
             (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
             (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
        }

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });


});