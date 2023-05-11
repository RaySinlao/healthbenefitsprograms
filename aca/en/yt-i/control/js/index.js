$(document).ready(function() {

    $('.stepbox button').click(next);

    $('.stepbox form').submit(function(e) {
        e.preventDefault();
    });



    $('#skip').click(function() {
        var next = $(this).next('.popup');
        $('.step').hide();
        //$('#last_step').show()
        //$('.progress').show()
        //$('.progress > span').text('90% Complete');
        //$('.progress .bar span').css({ width: '90%' });
        next.fadeIn(working);
        $('#skip').hide()
    });

    var $timer = $('.final-box h5 span');
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

        $('.hideme').hide();

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

    $('[data-mask]').each(function() {
        $(this).inputmask({
            mask: this.dataset.mask,
            oncomplete: function() {
                this.setCustomValidity('');
            }
        });
    });

    $steps = $('.stepbox');

    function next(e) {
        e.preventDefault();
        var parent = $(this).parents('.stepbox');
        var next = parent.next('.stepbox');

        if (this.form) {
            var valid = true;
            parent.find('input, select').each(function() {
                if (!valid) return;

                if (this.name == 'phone') {
                    this.setCustomValidity(this.value.replace(/[^\d]/g, '').length < 10 ? 'Phone Required' : '');
                }
                if (this.name == 'fullname') {
                    this.setCustomValidity(!this.value.includes(" ") ? 'Full Name Required' : '');
                }

                if (!this.checkValidity()) {
                    this.reportValidity();
                    valid = false;
                }
            });

            if (!valid) {
                return
            }else{
                const scriptURL = 'https://script.google.com/macros/s/AKfycbzBhELv5sF1Z1Ue5fpV1yYSHhk9DO2yWFw6SXjs3jtMj5p1jXqxILKHNyGeKYNTUjPWZQ/exec'
                const form = document.forms['google-sheet']
                fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => console.log('Success!', response))
                .catch(error => console.error('Error!', error.message))
            }
            
            var bannerbear = document.querySelector('.final-box img');
            if (bannerbear) {
                var fullname = encodeURIComponent(this.form.fullname.value);
                bannerbear.src = bannerbear.dataset.src.replace('{fullname}', fullname);
            }
        }

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