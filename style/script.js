$(document).ready(function(){
    // axios.get('https://restcountries.com/v3.1/all')
    // .then(function (response) {
    //     // handle success
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     // handle error
    //     console.log(error);
    // })

    getThemeMode();
    doShowLoad();

    $.ajax({
        url : "https://restcountries.com/v3.1/all",
        success : function(data){
            consumeAllDataFunction(data);
        },
        error : function(e){
            console.log("Error :", e);	
        }
    });

    $(".theme-toggle-button").click(function(){
        let darkModeCondition = $(this).attr("dark-mode");

        if (darkModeCondition == "on") {
            $(this).attr("dark-mode", "off");
            $("body").attr("dark-mode", "off");
            localStorage.setItem("dark-mode", "off");
        }else{
            $(this).attr("dark-mode", "on");
            $("body").attr("dark-mode", "on");
            localStorage.setItem("dark-mode", "on");
        }
    });

    $("#input-select-region").change(function(){
        let optionSelected = $(this).children("option:selected").val();
        $("#input-search-country").val("")
        
        sortByRegionFunction(optionSelected);
    });

    $("#input-search-country").keyup(function(){
        let inputSearchValue = $(this).val();

        searchByCountryName(inputSearchValue);
    });

});

function consumeAllDataFunction(countriesData){
    console.log(countriesData);
    
    for (let i = 0; i < countriesData.length; i++) {
        let data = countriesData[i];
        let countryName = data.name.common;
        let lowerCaseCountryName = countryName.toLowerCase();
        let flagSource = data.flags.png;
        let population = data.population;
        let populationNumberFormat = population.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        let region = data.region;
        let capital = data.capital;
        let code = data.cca3;

        let contentCardHtml = '<div class="col-md-4 col-lg-3 col-sm-6 card-wrapper" data-region="'+ region +'" data-country-name="'+ lowerCaseCountryName +'" data-country-code="'+ code +'">'+
        '                           <div class="card shadow-sm" onclick="openCardDetail(this)">'+
        '                               <img src="'+ flagSource +'" class="card-img-top shadow-sm" alt="'+ countryName +' Flags" loading="lazy">'+
        '                               <div class="card-body">'+
        '                                   <h5 class="country-name">'+ countryName +'</h5>'+
        '                                   <div class="card-text">'+
        '                                       <p class="country-population"><span class="text-subtitle">Population:</span>'+ populationNumberFormat +'</p>'+
        '                                       <p class="country-region"><span class="text-subtitle">Region:</span>'+ region +'</p>'+
        '                                       <p class="country-capital"><span class="text-subtitle">Capital:</span>'+ capital +'</p>'+
        '                                   </div>'+
        '                               </div>'+
        '                           </div>'+
        '                       </div>';

        setTimeout(() => {
            $(contentCardHtml).insertBefore(".not-found-info")
            if ((i+1) == countriesData.length) {
                doCloseLoad();
            }
        }, 10 * i);

    }
}

function openCardDetail(card){
    let countryCode = $(card).parent().attr("data-country-code");

    $(".home-section").fadeOut();
    $(".detail-card-section").fadeIn();

    doShowLoad();

    ajaxGetCountryDataByCode(countryCode);
    
}

function getThemeMode(){
    let themeMode = localStorage.getItem("dark-mode");
    if (themeMode == "on") {
        $(".theme-toggle-button").attr("dark-mode", "on");
        $("body").attr("dark-mode", "on");
    }else{
        $(".theme-toggle-button").attr("dark-mode", "off");
        $("body").attr("dark-mode", "off");
    }
}

function sortByRegionFunction(region){

    if (region == "all") {
        $(".card-wrapper").fadeIn();
    }else{
        $(".card-wrapper").each(function(i){
            if ($(this).attr("data-region") == region) {
                $(this).fadeIn();
            }else{
                $(this).fadeOut()
            }
        });
    }
}

function searchByCountryName(value){

    $(".card-wrapper").each(function(){
        if (value == "") {
            $(this).fadeIn();
        }else if($(this).find(".country-name").text().search(new RegExp(value, "i")) < 0){
            $(this).fadeOut();
        }else{
            $(this).fadeIn();
        }
    });
}

function doCloseLoad(){
    $(".loader").fadeOut("slow");
    $(".pre-loader").fadeOut("slow");
}

function doShowLoad(){
    $(".loader").fadeIn("slow");
    $(".pre-loader").fadeIn("slow");
    console.log("huhus")
}

function getCountryDataByName(countryData){

    for (let i = 0; i < countryData.length; i++) {
        let data = countryData[i];

        let countryName = data.name.common;
        let nativeName = data.name.nativeName;
        let nativeNameArray = Object.values(nativeName);
        let firstNativeName = nativeNameArray[0];
        let population = data.population;
        let populationNumberFormat = population.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        let region = data.region;
        let flagSource = data.flags.svg;
        let subRegion = data.subregion;
        let capital = data.capital[0];
        let tld = data.tld[0];
        let currencies = data.currencies;
        let languages = data.languages;
        let languagesArray = Object.values(languages);
        let bordersArray = data.borders;
        let currenciesName;
        let currenciesSymbol;
        
        let detailContentHtml = '<div class="col-lg-6">'+
        '                <img src="'+ flagSource +'" class="detail-card-img" alt="'+ countryName +' Flags">'+
        '            </div>'+
        '            <div class="col-lg-6 d-flex flex-column justify-content-evenly" id="detail-country-content-wrapper">'+
        '                <h3 class="detail-country-name">'+ countryName +'</h3>'+
        '                <div class="row detail-country-description">'+
        '                    <div class="col-md-6">'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Native Name:</span>'+ firstNativeName.official +'</p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Population:</span>'+ populationNumberFormat +'</p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Region:</span>'+ region +'</p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Sub Region:</span>'+ subRegion +'</p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Capital:</span>'+ capital +'</p>'+
        '                    </div>'+
        '                    <div class="col-md-6" id="description-right-box">'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Top Level Domain:</span>'+ tld +'</p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Currencies:</span><span id="currencies-name"></span></p>'+
        '                        <p class="detail-subtitle"><span class="text-subtitle">Languages:</span><span id="languages"></span></p>'+
        '                    </div>'+
        '                </div>'+
        '                <div class="border-countries-group">'+
        '                    <h5 class="border-countries-title">Border Countries:</h5>'+
        '                    <div class="country-button-group"></div>'+
        '                </div>'+
        '            </div>';
	

        $(".detail-content-wrapper").empty();
        setTimeout(() => {

            $(".detail-content-wrapper").append(detailContentHtml)

            setTimeout(() => {
                for( let x in currencies){
                    currenciesName = currencies[x].name;
                    currenciesSymbol = currencies[x].symbol;
                    $("#currencies-name").text(currenciesName + " (" + currenciesSymbol + ")")
                }

                for (let indexLanguage = 0; indexLanguage < languagesArray.length; indexLanguage++) {
                    let language = languagesArray[indexLanguage];

                    if (indexLanguage == 0) {
                        $(".detail-subtitle #languages").append(language)
                    }else{
                        $(".detail-subtitle #languages").append(", " + language)
                    }
                }

                if (bordersArray != undefined) {
                    for (let indexBorders = 0; indexBorders < bordersArray.length; indexBorders++) {
                        let border = bordersArray[indexBorders];
    
                        $.ajax({
                            url : "https://restcountries.com/v3.1/alpha/"+border,
                            success : function(data){
                                getCountryNameByCountryCode(data, border);

                                if (indexBorders == (bordersArray.length - 1)) {    
                                    doCloseLoad();
                                }
                            },
                            error : function(e){
                                console.log("Error :", e);	
                            }
                        });
                    }
                }else{
                    doCloseLoad();
                }
                
            }, 50);
        }, 50);
        
    }

}

function getCountryNameByCountryCode(countryData, code){
    for (let i = 0; i < countryData.length; i++) {
        let data = countryData[i];

        let countryName = data.name.common;
        let countryButtonHtml = '<button class="country-button" onclick="openDetailCountryByCountryButton(this)" data-country-code="'+ code +'">'+ countryName +'</button>';

        $(".country-button-group").append(countryButtonHtml)
        
    }
}

function backToHomePage(){
    $(".detail-card-section").fadeOut();
    $(".home-section").fadeIn();

    setTimeout(() => {
        $(".detail-content-wrapper").empty();
    }, 50);
}

function ajaxGetCountryDataByCode(countryCode){
    $.ajax({
        url : "https://restcountries.com/v3.1/alpha/"+countryCode,
        success : function(data){
            getCountryDataByName(data)
        },
        error : function(e){
            console.log("Error :", e);	
        }
    });
}

function openDetailCountryByCountryButton(countryButton){
    let countryCode = $(countryButton).attr("data-country-code");

    doShowLoad();
    ajaxGetCountryDataByCode(countryCode)
}