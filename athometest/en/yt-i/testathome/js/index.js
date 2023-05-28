// UUID function
!(function () {
	var n,
		r,
		t,
		e = 0,
		o = [];
	for (r = 0; r < 256; r++) o[r] = (r + 256).toString(16).substr(1);

	function u() {
		var r,
			t = ((r = 16), (!n || e + r > f.BUFFER_SIZE) && ((e = 0), (n = f.randomBytes(f.BUFFER_SIZE))), n.slice(e, (e += r)));
		return (t[6] = (15 & t[6]) | 64), (t[8] = (63 & t[8]) | 128), t;
	}

	function f() {
		var n = u();
		return (
			o[n[0]] +
			o[n[1]] +
			o[n[2]] +
			o[n[3]] +
			'-' +
			o[n[4]] +
			o[n[5]] +
			'-' +
			o[n[6]] +
			o[n[7]] +
			'-' +
			o[n[8]] +
			o[n[9]] +
			'-' +
			o[n[10]] +
			o[n[11]] +
			o[n[12]] +
			o[n[13]] +
			o[n[14]] +
			o[n[15]]
		);
	}
	(f.BUFFER_SIZE = 4096),
		(f.bin = u),
		(f.clearBuffer = function () {
			(n = null), (e = 0);
		}),
		(f.test = function (n) {
			return 'string' == typeof n && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(n);
		}),
		'undefined' != typeof crypto ? (t = crypto) : 'undefined' != typeof window && void 0 !== window.msCrypto && (t = window.msCrypto),
		'undefined' != typeof module && 'function' == typeof require
			? ((t = t || require('crypto')), (module.exports = f))
			: 'undefined' != typeof window && (window.uuid = f),
		(f.randomBytes = (function () {
			if (t) {
				if (t.randomBytes) return t.randomBytes;
				if (t.getRandomValues)
					return 'function' != typeof Uint8Array.prototype.slice
						? function (n) {
								var r = new Uint8Array(n);
								return t.getRandomValues(r), Array.from(r);
						  }
						: function (n) {
								var r = new Uint8Array(n);
								return t.getRandomValues(r), r;
						  };
			}
			return function (n) {
				var r,
					t = [];
				for (r = 0; r < n; r++) t.push(Math.floor(256 * Math.random()));
				return t;
			};
		})());
	// window.hbpHost = 'http://localhost:3001';
	window.hbpHost = 'https://api.healthbenefitsprograms.com';
	window.clientId = null;
	window.sessionId = null;
	Dropzone.autoDiscover = false;
	if (localStorage.getItem && localStorage.getItem('hbp_client')) {
		clientId = localStorage.getItem('hbp_client');
	} else {
		clientId = uuid();
		localStorage.setItem('hbp_client', clientId);
	}
	if (sessionStorage.getItem && sessionStorage.getItem('hbp_session')) {
		sessionId = sessionStorage.getItem('hbp_session');
	} else {
		sessionId = uuid();
		sessionStorage.setItem('hbp_session', sessionId);
	}
	let params = new URL(document.location).searchParams;
	if (localStorage.getItem && !localStorage.getItem('hbp_utm_set')) {
		localStorage.setItem('hbp_utm_content', params.get('utm_content'));
		localStorage.setItem('hbp_utm_campaign', params.get('utm_campaign'));
		localStorage.setItem('hbp_utm_source', params.get('utm_source'));
		localStorage.setItem('hbp_utm_term', params.get('utm_term'));
		localStorage.setItem('hbp_utm_medium', params.get('utm_medium'));
		localStorage.setItem('hbp_utm_set', '1');
	}
	for (const element of [
		'input[name=first_name]',
		'input[name=last_name]',
		'input[name=phone]',
		'input[name=email]',
		'input[name=address]',
		'input[name=city]',
		'select[name=state]',
		'input[name=zip_code]',
		'input[name=kaiser_permanente]',
		'input[name=covid_19_tests]',
		'input[name=kaiser_test]',
		'input[name=date_of_birth]',
		'input[name=insurance_subscriber_id_number]',
		'input[name=gender]',
		'input[name=kaiser_region]',
		'input[name=opt_checkbox]',
		'input[name=xxTrustedFormCertUrl]',
		'input[name=xxTrustedFormPingUrl]',
	]) {
		$(element).change(async () => {
			await updateLead();
		});
	}
	new Dropzone('#myDropzone', {
		url: `${window.hbpHost}/leads/${window.clientId}/insurance-card`,
		maxFiles: 1,
		maxFilesize: 15, // in MB
		acceptedFiles: 'image/*',
		resizeWidth: 800,
		resizeHeight: null,
		resizeMethod: 'contain',
		paramName: 'file',
		uploadMultiple: false,
		addRemoveLinks: true,
		init: function () {
			this.on('success', function (file, response) {
				$('#insurance_card_upload').val(response?.url);
			});
			this.on('error', function (file, errorMessage) {
				console.log('Error uploading file:', errorMessage);
			});
		},
	});
})();

$(document).on('scroll', function () {
	var y = $(this).scrollTop();
	if ($(window).width() < 576) {
		if (y > 150) {
			$('#step-1 .progress-bar-fixed-mobile').fadeIn();
		} else {
			$('.progress-bar-fixed-mobile').fadeOut();
		}
	}
});

async function updateLead() {
	await fetch(`${window.hbpHost}/leads`, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		redirect: 'follow',
		body: JSON.stringify({
			client_id: clientId,
			session_id: sessionId,
			first_name: $('input[name=first_name]').val(),
			last_name: $('input[name=last_name]').val(),
			phone: $('input[name=phone]').val(),
			email: $('input[name=email]').val(),
			address: $('input[name=address]').val(),
			city: $('input[name=city]').val(),
			state: $('select[name=state]').val(),
			zip: $('input[name=zip_code]').val(),
			have_kaiser: $('input[name=kaiser_permanente]:checked').val(),
			receive_monthly_tests: $('input[name=covid_19_tests]:checked').val(),
			last_received_test: $('input[name=kaiser_test]:checked').val(),
			birthdate: $('input[name=date_of_birth]').val(),
			insurance_policy_number: $('input[name=insurance_subscriber_id_number]').val(),
			gender: $('input[name=gender]:checked').val(),
			kaiser_region: $('input[name=kaiser_region]:checked').val(),
			agreed_to_order_tests: $('input[name=opt_checkbox]:checked').val(),
			trusted_form_cert_url: $('input[name=xxTrustedFormCertUrl]').val(),
			trusted_form_ping_url: $('input[name=xxTrustedFormPingUrl]').val(),
			origin: window.location.origin,
			path: window.location.pathname,
			client_id: clientId,
			session_id: sessionId,
			utm_content: localStorage.getItem('hbp_utm_content'),
			utm_campaign: localStorage.getItem('hbp_utm_campaign'),
			utm_source: localStorage.getItem('hbp_utm_source'),
			utm_term: localStorage.getItem('hbp_utm_term'),
			utm_medium: localStorage.getItem('hbp_utm_medium'),
			referrer: document.referrer,
		}),
	});
}

document.addEventListener(
	'DOMContentLoaded',
	function () {
		if ('AOS' in window) {
			AOS.init();
		}
	},
	false,
);

$(function () {
	$('[rel=tooltip]').tooltip({ placement: 'right' });

	var answeredQuestions = [];
	var questionList = [
		'first_name',
		'last_name',
		'email',
		'phone',
		'address',
		'city',
		'state',
		'zip',
		'date_of_birth',
		'insurance_company',
		'insurance_subscriber_id_number',
	]; // List of questions to be counted

	questionList.forEach(function (element) {
		var el_name = $('[name=' + element + ']');

		$(el_name).on('change input', function () {
			var el_name = $('[name=' + element + ']');

			if ($.inArray(element, answeredQuestions) == -1) {
				answeredQuestions.push(element);
				if (el_name.type == 'radio' || el_name.type == 'checkbox') {
					if (el_name.is(':checked')) {
						progress_add_step();
					}
				} else {
					if (el_name.val()) {
						progress_add_step();
					}
				}
			}
		});
	});

	$('#next-btn-1').on('click', function () {
		if (validator.checkAll() == 0) {
			$('#step-5').hide();
			setTimeout(function () {
				$('#step-6').show();
				$('form').find('input[name=date_of_birth]').trigger('focus');
				$('html, body').animate({ scrollTop: $('#lp_form').offset().top }, 100);
			}, 0);
		}
	});

	$('#next-btn-2').on('click', function () {
		if (validator.checkAll() == 0) {
			$('#step-6').hide();
			setTimeout(function () {
				$('#step-7').show();
				$('html, body').animate({ scrollTop: $('#lp_form').offset().top }, 100);
			}, 0);
		}
	});

	$('#lp_form').submit(function (e) {
		e.preventDefault();
		if (validator.checkAll() == 0) {
			$('.progress-bar').css('width', '100%');
			$('.progress-percentage').text('100%');

			$('#submit-btn').prop('disabled', true);
			$('#submit-btn').html(
				'Submitting... <div class="spinner-border spinner-border-sm ml-auto" role="status" aria-hidden="true"></div>',
			);

			$('input[name=phone]').mask('0000000000');

			var data = $('#lp_form').serialize();

			$('.formWrap').hide();
			$('#three_steps').hide();
			$('#couples').hide();
			$('.ty-wrap').show();
			$('#form-section').addClass('removeBg');

			var fname = $('input[name=first_name]').val();
			var lname = $('input[name=last_name]').val();
			var email = $('input[name=email]').val();
			var phone = $('input[name=phone]').val();
			var address = $('input[name=address]').val();
			var city = $('input[name=city]').val();
			var state = $('input[name=state]').val();
			var zip = $('input[name=zip_code]').val();
			var bday = $('input[name=date_of_birth]').val();
			var insuranceId = $('input[name=insurance_subscriber_id_number]').val();
			var gender = $('input[name=gender]:checked').val();
			var kaiser_region = $('input[name=kaiser_region]:checked').val();
			var idPhone = phone.replace('/[()-]/g', '');
			var cardImg = $('#insurance_card_upload').val();
			var TFCertUrl = $('input[name=xxTrustedFormCertUrl]').val();
			var TFPingUrl = $('input[name=xxTrustedFormPingUrl]').val();

			var date = new Date();
			var unixTimeStamp = Math.floor(date.getTime() / 1000);

			$('#timestamp').val(date.toISOString());
			_cio.identify({
				email: email,
				id: idPhone,
				created_at: unixTimeStamp,
				first_name: fname,
				last_name: lname,
				phone: '+1' + phone,
				offer: 'athometest',
				url_path: 'testathome',
				zipcode: zip,
				birthday: bday,
				insurance_subscriber_id_number: insuranceId,
				gender: gender,
				insurance_card_upload_image_name: cardImg,
				kaiser_region: kaiser_region,
				xxTrustedFormCertUrl: TFCertUrl,
				xxTrustedFormPingUrl: TFPingUrl,
			});
		}
	});

	$('.covid_test').click(function (e) {
		if ($(this).is(':checked')) {
			setTimeout(function () {
				$('#step-1').hide();
				$('#step-2').fadeIn();

				return false;
			}, 100);
		}
	});

	$('.kaiser_permanente').click(function (e) {
		if ($(this).is(':checked')) {
			setTimeout(function () {
				$('#step-2').hide();
				$('#step-4').fadeIn();

				return false;
			}, 100);
		}
	});

	$('.kaiser_medical_program').click(function (e) {
		if ($(this).is(':checked')) {
			setTimeout(function () {
				$('#step-3').hide();
				$('#step-4').fadeIn();

				return false;
			}, 100);
		}
	});

	$('.kaiser_test').click(function (e) {
		if ($(this).is(':checked')) {
			setTimeout(function () {
				$('#step-4').hide();

				/*if ( $('#test_yes').is(':checked') && $('#kaiser_yes').is(':checked') && $('#kaiser_medical_program_no').is(':checked') && ($('#test_never').is(':checked') || $('#test_last_month').is(':checked'))) {
          $("#step-5").fadeIn();

          return false;
        }*/

				if (
					$('#test_yes').is(':checked') &&
					$('#kaiser_yes').is(':checked') &&
					($('#test_never').is(':checked') || $('#test_last_month').is(':checked'))
				) {
					$('#step-5').fadeIn();

					return false;
				}

				$('#step-not-qualified').fadeIn();
				return false;
			}, 100);
		}
	});
});

$('input[name=phone]').mask('(000) 000-0000');
$('input[name=date_of_birth]').mask('00-00-0000', {
	placeholder: 'MM-DD-YYYY',
});

let validator = $('form.survey-form').jbvalidator();

validator.validator.birthday = function (el, event) {
	if ($(el).is('[name=date_of_birth]')) {
		var dateString = $(el).val();
		var dateParts = dateString.split('-');
		var year = parseInt(dateParts[2], 10);
		var month = parseInt(dateParts[0], 10);
		var day = parseInt(dateParts[1], 10);
		var isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31;

		if (isValidDate) {
			var dateObj = new Date(year, month - 1, day);
			isValidDate = dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;
		}

		if (!isValidDate) {
			return 'Invalid date format, should be mm/dd/yyyy';
		}
	}
};

//custom validate method for US phone
validator.validator.phone = function (el, event) {
	if ($(el).is('[name=phone]')) {
		var phone = $(el).val();
		phone = phone.replace(/[() -]/g, '');

		if (phone.length < 10) {
			return 'Please specify a valid phone number.';
		}

		if (!phone.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]\d{2}-?\d{4}$/)) {
			return 'Please specify a valid US phone number.';
		}
	}
};

//custom validate method for insurance_subscriber_id_number
validator.validator.insurance_subscriber_id_number = function (el, event) {
	if ($(el).is('[name=insurance_subscriber_id_number]')) {
		var insurance_subscriber_id_number = $(el).val();

		if (!insurance_subscriber_id_number.match(/^[0-9]+$/)) {
			return 'Should only contain numbers.';
		} else if (insurance_subscriber_id_number.length <= 5) {
			return 'Should be a minimum of 6 digits.';
		}
	}
};

//custom validate method for US Zip code
validator.validator.zip = function (el, event) {
	if ($(el).is('[name=zip_code]')) {
		var zip_code = $(el).val();
		zip_code = zip_code.replace(/\s+/g, '');

		if (zip_code.length < 5) {
			return 'Please specify a valid Zip Code.';
		}

		if (!zip_code.match(/\d{5}-\d{4}$|^\d{5}$|^90[2-5]\d\{2\}-\d{4}$/)) {
			return 'The specified US ZIP Code is invalid';
		}
	}
};

//custom validate method for gender
validator.validator.gender = function (el, event) {
	if ($(el).is('[name=gender]')) {
		var gender = $(el).val();

		if (gender == '') {
			return 'Please specify your gender.';
		}
	}
};

$('.scrolltoform').click(function () {
	$('html, body').animate(
		{
			scrollTop: $('#lp_form').offset().top,
		},
		100,
	);
});

/**
 *  Functions
 */

function progress_add_step() {
	var total_width = 0;
	var step = 8;
	var current_progress = parseFloat($('.progress-bar')[0].style.width);

	total_width = current_progress + step;
	$('.progress-bar').css('width', total_width + '%');
	$('.progress-percentage').text(total_width + '%');
}
