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

    });


    var $timer = $('.final-box h5 span');
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


        if (!interval) {
            interval = setInterval(startTimer, 1000);
        }
    }


    $steps = $('.stepbox');

    function next() {

        var parent = $(event.target).parent();
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

                return;
            }

            $('.main .popup').first().fadeIn(working);
        });
    }


});
