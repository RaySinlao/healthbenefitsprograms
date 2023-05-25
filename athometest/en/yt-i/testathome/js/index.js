// configure Dropzone
Dropzone.autoDiscover = false;
const { origin } = window.location

var imgPathUrl = origin+'/athometest/en/yt-i/testathome/uploads/'


var myDropzone = new Dropzone("#myDropzone", {
  url: origin+"/athometest/en/yt-i/testathome/upload.php",
  maxFiles: 1,
  maxFilesize: 15, // in MB
  acceptedFiles: 'image/*',
  resizeWidth: 800,
  resizeHeight: null,
  resizeMethod: 'contain',
  addRemoveLinks: true,
  init: function() {
    this.on("success", function(file, response) {
      $('#insurance_card_upload').val(imgPathUrl+file.name);
    });
    this.on("error", function(file, errorMessage) {
      console.log('Error uploading file:', errorMessage);
    });
  }
 
});


$(document).on('scroll', function() {
  var y = $(this).scrollTop();
  if (($(window).width() < 576)) {
    if (y > 150) {
      $('#step-1 .progress-bar-fixed-mobile').fadeIn();
    } else {
      $('.progress-bar-fixed-mobile').fadeOut();
    }
  }
});


document.addEventListener('DOMContentLoaded', function() {
	if ('AOS' in window) {
		AOS.init();
	}
}, false);



$(function(){


  $("[rel=tooltip]").tooltip({ placement: 'right'});

  var answeredQuestions = [];
  var questionList = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'date_of_birth', 'insurance_company', 'insurance_subscriber_id_number']; // List of questions to be counted

  questionList.forEach(function(element) {

    var el_name = $('[name='+element+']'); 

    $(el_name).on('change input', function(){

      var el_name = $('[name='+element+']'); 

      if($.inArray(element, answeredQuestions) == -1){
        answeredQuestions.push(element);
        if(el_name.type == 'radio' || el_name.type == 'checkbox'){
          if((el_name).is(':checked')){
            progress_add_step();
          }
        }else{
          if((el_name).val()){
            progress_add_step();
          }
        }  
      }
    })
  });

  $('#next-btn-1').on('click', function(){
    if(validator.checkAll() == 0 ){
      $('#step-5').hide();
      setTimeout(function(){         
        $('#step-6').show();
        $('form').find('input[name=date_of_birth]').trigger('focus');
        $('html, body').animate({ scrollTop: $("#lp_form").offset().top }, 100);
      }, 0);
    }
  });

  $('#next-btn-2').on('click', function(){
    if(validator.checkAll() == 0 ){
      $('#step-6').hide();
      setTimeout(function(){ 
        $('#step-7').show();
        $('html, body').animate({ scrollTop: $("#lp_form").offset().top }, 100);
      }, 0);
    }
  });

  $("#lp_form").submit(function(e){ 
    e.preventDefault();
    if(validator.checkAll() == 0 ){

      $(".progress-bar").css("width", '100%');
      $(".progress-percentage").text('100%');

      $('#submit-btn').prop('disabled', true);
      $('#submit-btn').html('Submitting... <div class="spinner-border spinner-border-sm ml-auto" role="status" aria-hidden="true"></div>');
    
      $('input[name=phone]').mask('0000000000');

      var data = $('#lp_form').serialize();

      $('.formWrap').hide();
      $('#three_steps').hide();
      $('#couples').hide();
      $('.ty-wrap').show();
      $('#form-section').addClass('removeBg');

       var fname = $("input[name=first_name]").val();
       var lname = $("input[name=last_name]").val();
       var email = $("input[name=email]").val();
       var phone = $("input[name=phone]").val();
       var address = $("input[name=address]").val();
       var city = $("input[name=city]").val();
       var state = $("input[name=state]").val();
       var zip = $("input[name=zip_code]").val();
       var bday = $("input[name=date_of_birth]").val();
       var insuranceId = $("input[name=insurance_subscriber_id_number]").val();
       var gender = $("input[name=gender]:checked").val();
       var kaiser_region = $("input[name=kaiser_region]:checked").val();
       var idPhone = phone.replace("/[()-]/g", "");
       var cardImg = $("#insurance_card_upload").val()
       var TFCertUrl = $("input[name=xxTrustedFormCertUrl]").val();
       var TFPingUrl = $("input[name=xxTrustedFormPingUrl]").val();

       var date = new Date();
       var unixTimeStamp = Math.floor(date.getTime() / 1000);

       $("#timestamp").val(date.toISOString())

       const scriptURL = 'https://script.google.com/macros/s/AKfycbwKLOzZeia05DWeBKU8EhD95jG2_2ugeSo1pDCNjJWFtrCd-AvGIQ8U517qreGyBV-r/exec'
       const form = document.forms['submit-to-google-sheet']

       fetch(scriptURL, { method: 'POST', body: new FormData(form)})
          .then(response => console.log('Success!'))
          .catch(error => console.error('Error!', error.message))


      _cio.identify({
          email: email,
          id: idPhone,
          created_at: unixTimeStamp,

          first_name: fname,
          last_name: lname,
          phone: '+1'+phone,
          offer: 'athometest',
          url_path: 'testathome',
          zipcode: zip,
          birthday: bday,
          insurance_subscriber_id_number: insuranceId,
          gender: gender,
          insurance_card_upload_image_name: imgPathUrl+cardImg,
          kaiser_region: kaiser_region,
          xxTrustedFormCertUrl: TFCertUrl,
          xxTrustedFormPingUrl: TFPingUrl,
      })

    }
  })



  $(".covid_test").click(function(e) {
    if ($(this).is(":checked")) {
      setTimeout(function(){
        $("#step-1").hide();
        $("#step-2").fadeIn();
        
        return false;
      }, 100);
    }

  });  
  
  $(".kaiser_permanente").click(function(e) {
    if ($(this).is(":checked")) {
      setTimeout(function(){
        $("#step-2").hide();
        $("#step-4").fadeIn();
        
        return false;
      }, 100);
    }
  });
  
  $(".kaiser_medical_program").click(function(e) {
    if ($(this).is(":checked")) {
      setTimeout(function(){
        $("#step-3").hide();
        $("#step-4").fadeIn();
       
        return false;
      }, 100);
    }
  });
  

  $(".kaiser_test").click(function(e) {
    if ($(this).is(":checked")) {
      setTimeout(function(){
        $("#step-4").hide();

        /*if ( $('#test_yes').is(':checked') && $('#kaiser_yes').is(':checked') && $('#kaiser_medical_program_no').is(':checked') && ($('#test_never').is(':checked') || $('#test_last_month').is(':checked'))) {
          $("#step-5").fadeIn();
         
          return false;
        }*/

                  
        if ( $('#test_yes').is(':checked') && $('#kaiser_yes').is(':checked') && ($('#test_never').is(':checked') || $('#test_last_month').is(':checked'))) {
          $("#step-5").fadeIn();
         
          return false;
        }

        $("#step-not-qualified").fadeIn();      
        return false;
      }, 100);
    }
  });
});

 
 $('input[name=phone]').mask('(000) 000-0000');
 $('input[name=date_of_birth]').mask('00-00-0000', {placeholder: "MM-DD-YYYY"});

 let validator = $('form.survey-form').jbvalidator();

  validator.validator.birthday = function(el, event){

    if($(el).is('[name=date_of_birth]')){
      var dateString = $(el).val();
      var dateParts = dateString.split("-");
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
  }


 //custom validate method for US phone
 validator.validator.phone = function(el, event){
 
   if($(el).is('[name=phone]')){
     var phone = $(el).val();
     phone = phone.replace(/[() -]/g, '');
 
     if((phone.length < 10)){
       return 'Please specify a valid phone number.';
     }
 
     if(!phone.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]\d{2}-?\d{4}$/)){
       return 'Please specify a valid US phone number.';
     }
   }
 } 
 
 //custom validate method for insurance_subscriber_id_number
 validator.validator.insurance_subscriber_id_number = function(el, event){
  if ($(el).is('[name=insurance_subscriber_id_number]')) {
    var insurance_subscriber_id_number = $(el).val();
    
    if (!insurance_subscriber_id_number.match(/^[0-9]+$/)) {
      return 'Should only contain numbers.';
    }
    else if (insurance_subscriber_id_number.length <= 5) {
      return 'Should be a minimum of 6 digits.';
    }
     
  }
}

 
 
 //custom validate method for US Zip code
 validator.validator.zip = function(el, event){
 
   if($(el).is('[name=zip_code]')){
     var zip_code = $(el).val();
     zip_code = zip_code.replace(/\s+/g, "");
 
     if((zip_code.length < 5)){
       return 'Please specify a valid Zip Code.';
     }
 
     if(!zip_code.match(/\d{5}-\d{4}$|^\d{5}$|^90[2-5]\d\{2\}-\d{4}$/)){
       return 'The specified US ZIP Code is invalid';
     }

   }
 }


//custom validate method for gender
validator.validator.gender = function(el, event){

  if($(el).is('[name=gender]')){
    var gender = $(el).val();
   
    if((gender == "")){
      return 'Please specify your gender.';
    }

  }
}

$(".scrolltoform").click(function() {
  $('html, body').animate({
      scrollTop: $("#lp_form").offset().top
  }, 100);
});
 


/**
 *  Functions
 */

  function progress_add_step(){
  var total_width = 0;
  var step = 8;
  var current_progress = parseFloat($(".progress-bar")[0].style.width);

  total_width = (current_progress + step);
  $(".progress-bar").css("width", total_width + '%');
  $(".progress-percentage").text(total_width + '%');
}