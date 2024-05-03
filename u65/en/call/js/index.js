let disqualify = true;
let disqualifyOption2 = false;

$(document).ready(function() {

    // Buttons on first Question
    $('.q1-btn').click((e) => {

        var targetYes = e.target.innerText

        if (targetYes === 'Yes') { 
            disqualify = false;
            $('.progress').css('display', 'block');
            $('.stepbox').css('display', 'none');
            $('.main .popup').first().fadeIn(working);
        }else{
            disqualify = true;
            next()
        }


    });

    // Buttons on first Question
    $('.q2-btn').click((e) => {
        var targetYes = e.target.innerText

        if (targetYes === 'No') {
            disqualify = false;
            $('.stepbox').css('display', 'none');
            $('.main .popup').first().fadeIn(working);
        }else{
           disqualify = true;
            next()
        }

        if (!interval) {
            interval = setInterval(startTimer, 1000);
        }

    });

    $("#formFields").submit(next) ;


    var $timer = $('.counter');
    var timer = 120;
    var interval = 0;

    function startTimer() {
        if (timer < 2) clearInterval(interval);
        var seconds = timer % 60;
        $timer.text(Math.floor(timer / 60) + ':' + seconds);
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


           if(next.hasClass('last-popup')){
             setTimeout(() => {
                $('.last-popup').css({'display': 'none'})
                if(disqualify){
                    $('#qualify').fadeIn()
                }else{
                    $('#disqualified').fadeIn()
                }

             }, 1500)
           }

        } else {
            $('.progress > span').text('100% Complete');
            $('.progress .bar span').css({ width: '100%' });
        }

    }


    $steps = $('.stepbox');

    function next() {

        var parent = $(event.target).parent();
        var next = parent.next('.stepbox');

        $('.progress').css({ display: '' });

        if(event.target.className === 'form_wrap'){

            event.preventDefault();

             if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('input[name=email]').val())){
                  alert("You have entered an invalid email address!")
                  return false;
              }

            var date = new Date();
            var unixTimeStamp = Math.floor(date.getTime() / 1000);
            var fname = $('input[name=firstname]').val();
            var lname = $('input[name=lastname]').val();
            var email = $('input[name=email]').val();
            var phone = $('input[name=phone]').val();

            var xxTrustedFormCertUrl = $('input[name=xxTrustedFormCertUrl]').val();
            var xxTrustedFormPingUrl = $('input[name=xxTrustedFormPingUrl]').val();
            
            var idPhone = phone.replace("+", "");

            _cio.identify({
                id: idPhone, 
                email: email,
                
                created_at: unixTimeStamp, 

                first_name: fname, 
                last_name: lname, 
                phone: phone,      
                offer: 'u65 Call',
                url_path: 'u65',
                xxTrustedFormCertUrl: xxTrustedFormCertUrl,
                xxTrustedFormPingUrl: xxTrustedFormPingUrl
            });

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
