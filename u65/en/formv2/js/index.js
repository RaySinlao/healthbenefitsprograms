$(document).ready(function() {

    var medicare;
    var liveUS;

    $('#zipInput').mask('999999');

    $('#zipInput').keypress(function(e){
        if (String.fromCharCode(e.keyCode).match(/[^0-9]/g)) return false;
    })

    $('.q-btn-zip').click(function() {
        var zip = document.querySelectorAll("input[name=zip]")[0].value;
        if(!zip){
             $('input[name="zip"]').css('border', '1px solid red');
             $('.zipWrap small').show();
            return false;
        }

        next()
    })


    // Buttons on first Question
    $('.q1-btn').click((e) => {

        var targetYes = e.target.innerText

        medicare = targetYes

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

        liveUS = targetYes

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

            if (next.hasClass('last-popup')){
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


        if(event.target.className === 'form_wrap'){

            event.preventDefault();
            

             if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('input[name=email]').val())){
                  alert("You have entered an invalid email address!")
                  return false;
              }

                var fname = document.querySelectorAll("input[name=firstname]")[0].value;
                var lname = document.querySelectorAll("input[name=lastname]")[0].value;
                var email = document.querySelectorAll("input[name=email]")[0].value;
                var phone = document.querySelectorAll("input[name=phone]")[0].value;
                var zip = document.querySelectorAll("input[name=zip]")[0].value;
                var idPhone = phone.replace("+", "");
                var idPhone2 = phone.replace("+1", "");
                var TFCertUrl = document.querySelectorAll("input[name=xxTrustedFormCertUrl]")[0].value;
                var TFPingUrl = document.querySelectorAll("input[name=xxTrustedFormPingUrl]")[0].value;



                /*var form = new FormData();
                var settings = {
                  "url": "https://display.ringba.com/enrich/1862148362610934921?callerid=+16198615168&zipcode=33109",
                  "method": "GET",
                  "timeout": 0,
                  "headers": {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                  "processData": false,
                  "mimeType": "multipart/form-data",
                  "contentType": false,
                  "data": form
                };

                $.ajax(settings).done(function (response) {
                  console.log(response);
                });  */


                var raw = JSON.stringify({
                  FName: fname,
                  LName: lname,
                  Phone: Number(idPhone2),
                  Email: email,
                  immediate: true,
                });

                var requestOptions = {
                  method: "POST",
                  contentType: "application/json",
                  body: raw,
                };

                fetch(
                  "https://us-west2-vigilant-host-378718.cloudfunctions.net/api-form",
                  requestOptions
                )
                  .then((response) => response.json())
                  .then((data) => {

                    var date = new Date();
                    var unixTimeStamp = Math.floor(date.getTime() / 1000);
                    
                
                    if(data){
                        
                      _cio.identify({

                        email: email,
                        id: idPhone,
                        created_at: unixTimeStamp,

                        first_name: fname,
                        last_name: lname,
                        phone: phone,
                        offer: 'u65',
                        url_path: 'formv2',
                        medicare_medicaid: medicare,
                        live_in_US: liveUS,
                        zipcode: zip,
                        xxTrustedFormCertUrl: TFCertUrl,
                        xxTrustedFormPingUrl: TFPingUrl,

                        IDS: {
                            AID: data.result.IDAttributes.AutoAttributes.IDS.AID,
                            HHID: data.result.IDAttributes.AutoAttributes.IDS.HHID,
                            PID: data.result.IDAttributes.AutoAttributes.IDS.PID,
                        },
                        Vehicle: {
                            ClassCD: data.result.IDAttributes.AutoAttributes.Vehicle.ClassCD,
                            FuelTypeCD: data.result.IDAttributes.AutoAttributes.Vehicle.FuelTypeCD,
                            MFGCD: data.result.IDAttributes.AutoAttributes.Vehicle.MFGCD,
                            Make: data.result.IDAttributes.AutoAttributes.Vehicle.Make,
                            Mileages: data.result.IDAttributes.AutoAttributes.Vehicle.Mileages,
                            Model: data.result.IDAttributes.AutoAttributes.Vehicle.Model,
                            ODate: data.result.IDAttributes.AutoAttributes.Vehicle.ODate,
                            StyleCD: data.result.IDAttributes.AutoAttributes.Vehicle.StyleCD,
                            VIN: data.result.IDAttributes.AutoAttributes.Vehicle.VIN,
                            Year: data.result.IDAttributes.AutoAttributes.Vehicle.Year,
                        },
                        Vehicle2: {
                            ClassCD: data.result.IDAttributes.AutoAttributes.Vehicle2.ClassCD,
                            FuelTypeCD: data.result.IDAttributes.AutoAttributes.Vehicle2.FuelTypeCD,
                            MFGCD: data.result.IDAttributes.AutoAttributes.Vehicle2.MFGCD,
                            Make: data.result.IDAttributes.AutoAttributes.Vehicle2.Make,
                            Mileages: data.result.IDAttributes.AutoAttributes.Vehicle2.Mileages,
                            Model: data.result.IDAttributes.AutoAttributes.Vehicle2.Model,
                            ODate: data.result.IDAttributes.AutoAttributes.Vehicle2.ODate,
                            StyleCD: data.result.IDAttributes.AutoAttributes.Vehicle2.StyleCD,
                            VIN: data.result.IDAttributes.AutoAttributes.Vehicle2.VIN,
                            Year: data.result.IDAttributes.AutoAttributes.Vehicle2.Year,
                        },
                        Vehicle3: {
                            ClassCD: data.result.IDAttributes.AutoAttributes.Vehicle3.ClassCD,
                            FuelTypeCD: data.result.IDAttributes.AutoAttributes.Vehicle3.FuelTypeCD,
                            MFGCD: data.result.IDAttributes.AutoAttributes.Vehicle3.MFGCD,
                            Make: data.result.IDAttributes.AutoAttributes.Vehicle3.Make,
                            Mileages: data.result.IDAttributes.AutoAttributes.Vehicle3.Mileages,
                            Model: data.result.IDAttributes.AutoAttributes.Vehicle3.Model,
                            ODate: data.result.IDAttributes.AutoAttributes.Vehicle3.ODate,
                            StyleCD: data.result.IDAttributes.AutoAttributes.Vehicle3.StyleCD,
                            VIN: data.result.IDAttributes.AutoAttributes.Vehicle3.VIN,
                            Year: data.result.IDAttributes.AutoAttributes.Vehicle3.Year,
                        },
                        Vehicle4: {
                            ClassCD: data.result.IDAttributes.AutoAttributes.Vehicle4.ClassCD,
                            FuelTypeCD: data.result.IDAttributes.AutoAttributes.Vehicle4.FuelTypeCD,
                            MFGCD: data.result.IDAttributes.AutoAttributes.Vehicle4.MFGCD,
                            Make: data.result.IDAttributes.AutoAttributes.Vehicle4.Make,
                            Mileages: data.result.IDAttributes.AutoAttributes.Vehicle4.Mileages,
                            Model: data.result.IDAttributes.AutoAttributes.Vehicle4.Model,
                            ODate: data.result.IDAttributes.AutoAttributes.Vehicle4.ODate,
                            StyleCD: data.result.IDAttributes.AutoAttributes.Vehicle4.StyleCD,
                            VIN: data.result.IDAttributes.AutoAttributes.Vehicle4.VIN,
                            Year: data.result.IDAttributes.AutoAttributes.Vehicle4.Year,
                        },
                        Demographics: {
                            Age: data.result.IDAttributes.DemographicAttributes.Demographics.Age,
                            CharityDnr: data.result.IDAttributes.DemographicAttributes.Demographics.CharityDnr,
                            ChildAgeCd: data.result.IDAttributes.DemographicAttributes.Demographics.ChildAgeCd,
                            ChildCd: data.result.IDAttributes.DemographicAttributes.Demographics.ChildCd,
                            ChildNbrCd: data.result.IDAttributes.DemographicAttributes.Demographics.ChildNbrCd,
                            CreditCard: data.result.IDAttributes.DemographicAttributes.Demographics.CreditCard,
                            DemoLvl: data.result.IDAttributes.DemographicAttributes.Demographics.DemoLvl,
                            DwellType: data.result.IDAttributes.DemographicAttributes.Demographics.DwellType,
                            EHI: data.result.IDAttributes.DemographicAttributes.Demographics.EHI,
                            Education: data.result.IDAttributes.DemographicAttributes.Demographics.Education,
                            Ethnicity: data.result.IDAttributes.DemographicAttributes.Demographics.Ethnicity,
                            FirePl: data.result.IDAttributes.DemographicAttributes.Demographics.FirePl,
                            Gender: data.result.IDAttributes.DemographicAttributes.Demographics.Gender,
                            HHNBRSR: data.result.IDAttributes.DemographicAttributes.Demographics.HHNBRSR,
                            Homeowner: data.result.IDAttributes.DemographicAttributes.Demographics.Homeowner,
                            LOR: data.result.IDAttributes.DemographicAttributes.Demographics.LOR,
                            MHV: data.result.IDAttributes.DemographicAttributes.Demographics.MHV,
                            MOR: data.result.IDAttributes.DemographicAttributes.Demographics.MOR,
                            Married: data.result.IDAttributes.DemographicAttributes.Demographics.Married,
                            MedSchl: data.result.IDAttributes.DemographicAttributes.Demographics.MedSchl,
                            MedYrBld: data.result.IDAttributes.DemographicAttributes.Demographics.MedYrBld,
                            MobHome: data.result.IDAttributes.DemographicAttributes.Demographics.MobHome,
                            MrktHomeVal: data.result.IDAttributes.DemographicAttributes.Demographics.MrktHomeVal,
                            PctAsi: data.result.IDAttributes.DemographicAttributes.Demographics.PctAsi,
                            PctAsiaSpeak: data.result.IDAttributes.DemographicAttributes.Demographics.PctAsiaSpeak,
                            PctAuto: data.result.IDAttributes.DemographicAttributes.Demographics.PctAuto,
                            PctBlk: data.result.IDAttributes.DemographicAttributes.Demographics.PctBlk,
                            PctBlueCollar: data.result.IDAttributes.DemographicAttributes.Demographics.PctBlueCollar,
                            PctEngSpeak: data.result.IDAttributes.DemographicAttributes.Demographics.PctEngSpeak,
                            PctHsp: data.result.IDAttributes.DemographicAttributes.Demographics.PctHsp,
                            PctMFDU: data.result.IDAttributes.DemographicAttributes.Demographics.PctMFDU,
                            PctOccO: data.result.IDAttributes.DemographicAttributes.Demographics.PctOccO,
                            PctSFDU: data.result.IDAttributes.DemographicAttributes.Demographics.PctSFDU,
                            PctSpnSpeak: data.result.IDAttributes.DemographicAttributes.Demographics.PctSpnSpeak,
                            PctWhiteCollar: data.result.IDAttributes.DemographicAttributes.Demographics.PctWhiteCollar,
                            PctWht: data.result.IDAttributes.DemographicAttributes.Demographics.PctWht,
                            Pool: data.result.IDAttributes.DemographicAttributes.Demographics.SglParent,
                            SglParent: data.result.IDAttributes.DemographicAttributes.Demographics.SglParent,
                            VehLux: data.result.IDAttributes.DemographicAttributes.Demographics.VehLux,
                            VehSuv: data.result.IDAttributes.DemographicAttributes.Demographics.VehSuv,
                            VehTrk: data.result.IDAttributes.DemographicAttributes.Demographics.VehTrk,
                            WealthScr: data.result.IDAttributes.DemographicAttributes.Demographics.WealthScr
                        },
                        LifeStyles: {
                            PIArts: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIArts,
                            PIAuto: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIAuto,
                            PIBoat: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIBoat,
                            PIBookBuy: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIBookBuy,
                            PIBookRead: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIBookRead,
                            PIChildAprl: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIChildAprl,
                            PICollect: data.result.IDAttributes.DemographicAttributes.LifeStyles.PICollect,
                            PICookWine: data.result.IDAttributes.DemographicAttributes.LifeStyles.PICookWine,
                            PIFitness: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIFitness,
                            PIGamble: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIGamble,
                            PIHiTech: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIHiTech,
                            PIHomeGrd: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIHomeGrd,
                            PIHomeImp: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIHomeImp,
                            PIInvst: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIInvst,
                            PIMenAprl: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIMenAprl,
                            PIMoto: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIMoto,
                            PIOutdoor: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIOutdoor,
                            PIPetAprl: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIPetAprl,
                            PIPriceClub: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIPriceClub,
                            PISelfImp: data.result.IDAttributes.DemographicAttributes.LifeStyles.PISelfImp,
                            PISport: data.result.IDAttributes.DemographicAttributes.LifeStyles.PISport,
                            PITravel: data.result.IDAttributes.DemographicAttributes.LifeStyles.PITravel,
                            PIWomanAprl: data.result.IDAttributes.DemographicAttributes.LifeStyles.PIWomanAprl,
                        },
                        PowerScore: {
                            PurPowerScr: data.result.IDAttributes.DemographicAttributes.PowerScore.PurPowerScr,
                            ScoreCode: data.result.IDAttributes.DemographicAttributes.PowerScore.ScoreCode,
                        }, 
                        IPAttributes: {
                            City: data.result.IDAttributes.IPAttributes.City,
                            IP: data.result.IDAttributes.IPAttributes.IP,
                            IPFrom: data.result.IDAttributes.IPAttributes.IPFrom,
                            IPRegion: data.result.IDAttributes.IPAttributes.IPRegion,
                            IPTo: data.result.IDAttributes.IPAttributes.IPTo,
                            ISP: data.result.IDAttributes.IPAttributes.ISP,
                            Latitude: data.result.IDAttributes.IPAttributes.Latitude,
                            Longitude: data.result.IDAttributes.IPAttributes.Longitude,
                            Zip: data.result.IDAttributes.IPAttributes.Zip,
                        },
                        PhoneAttributes: {
                            PhoneType: data.result.IDAttributes.PhoneAttributes.PhoneType,
                            PhoneType2: data.result.IDAttributes.PhoneAttributes.PhoneType2,
                        },
                        AdditionalInformation: {
                            ADDRIND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_ADDRIND,
                            APPRAISED_IMPVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_APPRAISED_IMPVAL,
                            APPRAISED_LANDVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_APPRAISED_LANDVAL,
                            APPRAISED_VAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_APPRAISED_VAL,
                            APTNBR: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_APTNBR,
                            ASSED_IMPVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_ASSED_IMPVAL,
                            ASSED_LANDVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_ASSED_LANDVAL,
                            ASSED_VAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_ASSED_VAL,
                            BLDGCD: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_BLDGCD,
                            BLDGIMPCD: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_BLDGIMPCD,
                            CNSTRTYPE: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_CNSTRTYPE,
                            COND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_COND,
                            CORPIND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_CORPIND,
                            EXTNW: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_EXTNW,
                            IMP_VALCALC: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_IMP_VALCALC,
                            IMP_VALCALC_IND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_IMP_VALCALC_IND,
                            IND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_IND,
                            LAND_VALCALC: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_LAND_VALCALC,
                            LAND_VALCALC_IND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_LAND_VALCALC_IND,
                            MOBHOME: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_MOBHOME,
                            MRKTVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_MRKTVAL,
                            MRKT_IMPVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_MRKT_IMPVAL,
                            MRKT_LANDVAL: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_MRKT_LANDVAL,
                            NRBBLD: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_NRBBLD,
                            OWNEROCC: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_OWNEROCC,
                            QLTY: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_QLTY,
                            RESCD: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_RESCD,
                            STORIESCD: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_STORIESCD,
                            STORIESNBR: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_STORIESNBR,
                            STYLE: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_STYLE,
                            VALCALC: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_VALCALC,
                            VAL_CALCIND: data.result.IDAttributes.PropertyAttributes.AdditionalInformation.PROP_VAL_CALCIND,
                        },
                        AssessorDeed: {
                            APNCD: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_APNCD,
                            APNCNT: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_APNCNT,
                            ASMTYR: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_ASMTYR,
                            DOCYR: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_DOCYR,
                            HOMESTEAD: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_HOMESTEAD,
                            RECDATE: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_RECDATE,
                            SALEAMT: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SALEAMT,
                            SALECD: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SALECD,
                            SALEDATE: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SALEDATE,
                            SALESDEEDCD: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SALESDEEDCD,
                            SALESTRANSCD: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SALESTRANSCD,
                            SELLERNAME: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_SELLERNAME,
                            TAXAMT: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_TAXAMT,
                            TAXYR: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_TAXYR,
                            XMTVET: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_XMTVET,
                            XMT_DISABLED: data.result.IDAttributes.PropertyAttributes.AssessorDeed.PROP_XMT_DISABLED,
                        },  
                        Attributes: {
                            QTRBATHS1: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_1QTRBATHS,
                            QTRBATHS3: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_3QTRBATHS,
                            AC: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_AC,
                            ACRES: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_ACRES,
                            ADJGROSSSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_ADJGROSSSQFT,
                            BATHFIXS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BATHFIXS,
                            BATHS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BATHS,
                            BATHSCALC: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BATHSCALC,
                            BEDRMS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BEDRMS,
                            BLDSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BLDSQFT,
                            BLDSQFTIND: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BLDSQFTIND,
                            BSMTF: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BSMTF,
                            BSMTSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_BSMTSQFT,
                            DEPTHFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_DEPTHFT,
                            EFFYRBLD: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_EFFYRBLD,
                            ENERGY: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_ENERGY,
                            FLR: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FLR,
                            FND: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FND,
                            FRAME: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FRAME,
                            FRONTFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FRONTFT,
                            FRPL: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FRPL,
                            FRPLNBR: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FRPLNBR,
                            FRPLTYPE: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FRPLTYPE,
                            FUEL: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FUEL,
                            FULLBATHS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_FULLBATHS,
                            GAR: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_GAR,
                            GRDFLRSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_GRDFLRSQFT,
                            GROSSSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_GROSSSQFT,
                            HALFBATHS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_HALFBATHS,
                            HEAT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_HEAT,
                            LANDSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_LANDSQFT,
                            LCTN_INFL: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_LCTN_INFL,
                            LIVINGSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_LIVINGSQFT,
                            POOL: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_POOL,
                            POOLCD: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_POOLCD,
                            PRKGSPACES: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_PRKGSPACES,
                            PRKGSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_PRKGSQFT,
                            PRKGTYPE: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_PRKGTYPE,
                            RMS: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_RMS,
                            ROOFCOVER: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_ROOFCOVER,
                            ROOFTYPE: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_ROOFTYPE,
                            SEWER: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_SEWER,
                            UNVBLDSQFT: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_UNVBLDSQFT,
                            VIEW: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_VIEW,
                            WATER: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_WATER,
                            YRBLD: data.result.IDAttributes.PropertyAttributes.Attributes.PROP_YRBLD,
                        },
                        Location: {
                            FIPSCD: data.result.IDAttributes.PropertyAttributes.Location.FIPSCD,
                            APN: data.result.IDAttributes.PropertyAttributes.Location.PROP_APN,
                            APNSEQNBR: data.result.IDAttributes.PropertyAttributes.Location.PROP_APNSEQNBR,
                            CENSUSTRACT: data.result.IDAttributes.PropertyAttributes.Location.PROP_CENSUSTRACT,
                            LANDUSE: data.result.IDAttributes.PropertyAttributes.Location.PROP_LANDUSE,
                            LATITUDE: data.result.IDAttributes.PropertyAttributes.Location.PROP_LATITUDE,
                            LONGITUDE: data.result.IDAttributes.PropertyAttributes.Location.PROP_LONGITUDE,
                            MUNINAME: data.result.IDAttributes.PropertyAttributes.Location.PROP_MUNINAME,
                            RANGE: data.result.IDAttributes.PropertyAttributes.Location.PROP_RANGE,
                            SECTION: data.result.IDAttributes.PropertyAttributes.Location.PROP_SECTION,
                            SUBDIVISION: data.result.IDAttributes.PropertyAttributes.Location.PROP_SUBDIVISION,
                            TOWNSHIPCD: data.result.IDAttributes.PropertyAttributes.Location.PROP_TOWNSHIPCD,
                            ZONING: data.result.IDAttributes.PropertyAttributes.Location.PROP_ZONING,
                        },
                        PriorSale: {
                            APNCD_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_APNCD_PRIOR,
                            DEEDCD_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_DEEDCD_PRIOR,
                            DEEDTYPE_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_DEEDTYPE_PRIOR,
                            DOCYR_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_DOCYR_PRIOR,
                            MTGAMT_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_MTGAMT_PRIOR,
                            RECDATE_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_RECDATE_PRIOR,
                            SALEAMT_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_SALEAMT_PRIOR,
                            SALECD_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_SALECD_PRIOR,
                            SALEDATE_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_SALEDATE_PRIOR,
                            SALESTRANSCD_PRIOR: data.result.IDAttributes.PropertyAttributes.PriorSale.PROP_SALESTRANSCD_PRIOR,
                        },
                        IDScores: {
                            AddressConfidenceScore: data.result.IDScores.AddressConfidenceScore,
                            AddressToEmail: data.result.IDScores.AddressToEmail,
                            AddressToPhone: data.result.IDScores.AddressToPhone,
                            AddressToPhone2: data.result.IDScores.AddressToPhone2,
                            Deceased: data.result.IDScores.Deceased,
                            IDVerifyScore: data.result.IDScores.IDVerifyScore,
                            LinkageCount: data.result.IDScores.LinkageCount,
                            LinkageSummary: data.result.IDScores.LinkageSummary,
                            ameToAddress: data.result.IDScores.NameToAddress,
                            NameToEmail: data.result.IDScores.NameToEmail,
                            NameToPhone: data.result.IDScores.NameToPhone,
                            NameToPhone2: data.result.IDScores.NameToPhone2,
                            Phone2ConfidenceScore: data.result.IDScores.Phone2ConfidenceScore,
                            Phone2ToEmail: data.result.IDScores.Phone2ToEmail,
                            PhoneConfidenceScore: data.result.IDScores.PhoneConfidenceScore,
                            PhoneToEmail: data.result.IDScores.PhoneToEmail,
                            RiskFlagCount: data.result.IDScores.RiskFlagCount,
                            RiskFlagSummary: data.result.IDScores.RiskFlagSummary,
                            USLocation: data.result.IDScores.USLocation,
                            ValidAddress: data.result.IDScores.ValidAddress,
                            ValidCount: data.result.IDScores.ValidCount,
                            ValidEmail: data.result.IDScores.ValidEmail,
                            ValidName: data.result.IDScores.ValidName,
                            ValidPhone: data.result.IDScores.ValidPhone,
                            ValidPhone2: data.result.IDScores.ValidPhone2,
                            ValidZip: data.result.IDScores.ValidZip,
                            ValidationSummary: data.result.IDScores.ValidationSummary,
                            ZipToPhone: data.result.IDScores.ZipToPhone,
                        },
                        Address: {
                            AptNbr: data.result.Identity.Address.AptNbr,
                            AptType: data.result.Identity.Address.AptType,
                            CNTY: data.result.Identity.Address.CNTY,
                            CRTE: data.result.Identity.Address.CRTE,
                            City: data.result.Identity.Address.City,
                            DPC: data.result.Identity.Address.DPC,
                            DPV: data.result.Identity.Address.DPV,
                            Deliverable: data.result.Identity.Address.Deliverable,
                            House: data.result.Identity.Address.House,
                            PostDir: data.result.Identity.Address.PostDir,
                            PreDir: data.result.Identity.Address.PreDir,
                            State: data.result.Identity.Address.State,
                            StrType: data.result.Identity.Address.StrType,
                            Street: data.result.Identity.Address.Street,
                            ValDate: data.result.Identity.Address.ValDate,
                            Z4: data.result.Identity.Address.Z4,
                            Z4Type: data.result.Identity.Address.Z4Type,
                            Zip: data.result.Identity.Address.Zip,
                        },
                        Email: {
                            Category: data.result.Identity.Emails.Email.Category,
                            Email: data.result.Identity.Emails.Email.Email,
                            ODate: data.result.Identity.Emails.Email.ODate,
                            Score: data.result.Identity.Emails.Email.Score,
                            Suppression: data.result.Identity.Emails.Email.Suppression,
                            Url: data.result.Identity.Emails.Email.Url,
                        },
                        Name: {
                            BusName: data.result.Identity.Name.BusName,
                            FName: data.result.Identity.Name.FName,
                            LName: data.result.Identity.Name.LName,
                            MName: data.result.Identity.Name.MName,
                        },
                        Phone: {
                            Category: data.result.Identity.Phones.Phone.Category,
                            DACode: data.result.Identity.Phones.Phone.DACode,
                            DID: data.result.Identity.Phones.Phone.DID,
                            IDate: data.result.Identity.Phones.Phone.IDate,
                            ODate: data.result.Identity.Phones.Phone.ODate,
                            PHV: data.result.Identity.Phones.Phone.PHV,
                            Phone: data.result.Identity.Phones.Phone.Phone,
                            PhoneType: data.result.Identity.Phones.Phone.PhoneType,
                            RecType: data.result.Identity.Phones.Phone.RecType,
                            Score: data.result.Identity.Phones.Phone.Score,
                            TelcoName: data.result.Identity.Phones.Phone.TelcoName,
                        },
                        Mortgage: {
                            LENDERNAME: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_LENDERNAME,
                            LENDERNAME2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_LENDERNAME2,
                            LENDERNAME3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_LENDERNAME3,
                            LOANTOVAL: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_LOANTOVAL,
                            MTGAMT: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGAMT,
                            MTGAMT2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGAMT2,
                            MTGAMT3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGAMT3,
                            MTGASSUMPTIONAMT: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGASSUMPTIONAMT,
                            MTGASSUMPTIONAMT2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGASSUMPTIONAMT2,
                            MTGASSUMPTIONAMT3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGASSUMPTIONAMT3,
                            MTGDATE: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDATE,
                            MTGDEEDCD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDEEDCD,
                            MTGDEEDCD2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDEEDCD2,
                            MTGDEEDCD3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDEEDCD3,
                            MTGDUEDATE: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDUEDATE,
                            MTGDUEDATE2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDUEDATE2,
                            MTGDUEDATE3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGDUEDATE3,
                            MTGINTCD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTCD,
                            MTGINTRATE: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATE,
                            MTGINTRATE2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATE2,
                            MTGINTRATE3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATE3,
                            MTGINTRATETYPE: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATETYPE,
                            MTGINTRATETYPE2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATETYPE2,
                            MTGINTRATETYPE3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGINTRATETYPE3,
                            MTGLOANCD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGLOANCD,
                            MTGLOANCD2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGLOANCD2,
                            MTGLOANCD3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGLOANCD3,
                            MTGREFICD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGREFICD,
                            MTGREFICD2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGREFICD2,
                            MTGREFICD3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGREFICD3,
                            MTGTERM: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGTERM,
                            MTGTERM2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGTERM2,
                            MTGTERM3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_MTGTERM3,
                            OWNERCD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_OWNERCD,
                            RMSEQUITYCD: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_RMSEQUITYCD,
                            RMSEQUITYCD2: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_RMSEQUITYCD2,
                            RMSEQUITYCD3: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_RMSEQUITYCD3,
                            SELLCARRYBACK: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_SELLCARRYBACK,
                            TITTLECOMPANY: data.result.IDAttributes.PropertyAttributes.Mortgage.PROP_TITTLECOMPANY,
                        },
                      });
                    
                     console.log('Succes!')

                    }

                  })
                  .catch((error) => console.log("error", error));


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