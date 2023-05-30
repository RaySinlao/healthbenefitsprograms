$(document).ready(function() {

    $('.stepbox .q-btn').click(next);


    $('.q2 .q-btn').click(function(){ 

        if (!interval) {
            interval = setInterval(startTimer, 1000);
        }
    });

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



    function formatPhoneNumber(phoneNumber) {
            // Remove all non-digit characters from the phone number
            const digits = phoneNumber.replace(/\D/g, '');
            // Add the country code prefix if it's not already there
        if (digits.length === 10) {
            return '+1' + digits;
        } else if (digits.length === 11) {
            return '+' + digits;
        } else {
            // If the phone number doesn't have 10 or 11 digits, return null
            return null;
        }
    }


    $steps = $('.stepbox');

    function next(e) {
        e.preventDefault();


        var parent = $(this).parents('.stepbox');
        var next = parent.next('.stepbox');

        $('.progress').css({ display: '' });

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



});