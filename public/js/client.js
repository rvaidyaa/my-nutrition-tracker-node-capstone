//Step 1 - Define Functions and Objects

var loggedInUser = "";


function checkLogedInUser(nowUnixTime, loggedInUser) {
    console.log("current logged in user = ", loggedInUser);
}

function registerUser(username, password) {
    console.log('inside fn registerUser');
    console.log(username, password);

    const unamePwObject = {
        username: username,
        password: password
    };

    $.ajax({
            type: "POST",
            url: "/users/create",
            dataType: 'json',
            data: JSON.stringify(unamePwObject),
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            alert('Welcome to my Nutrition tracker, you may now sign in from the home page!');
            // go to main signin page
            //            backToHomePage();
            $('#js-signup').hide();


        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Invalid username and password combination. Please check your username and password and try again.');
        });
}

function loginUser(inputUname, inputPw) {
    console.log('inside fn loginUser')
    const unamePwObject = {
        username: inputUname,
        password: inputPw
    };
    console.log(unamePwObject);
    $.ajax({
            type: "POST",
            url: "/users/login",
            dataType: 'json',
            data: JSON.stringify(unamePwObject),
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            loggedInUser = result.username;
            // show the signout link in header as soon as user is signed in
            // go to login page

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            //            alert('Invalid username and password combination. Pleae check your username and password and try again.');
        });
}

function ajaxNutritionSearch(searchTerm) {

    $.ajax({
            type: "GET",
            url: "/ingredient/" + searchTerm,
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput);
            console.log(dataOutput.branded[0].brand_name);



            displayNutritionSearch(dataOutput.branded);
            // displayActiveActivityResults(JSON.parse(resultsForJsonParse));
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
//GET https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f

//HEADERS required:
//
//x-app-id
//x-app-key
//Response body:
function ajaxNutritionFind(nixId) {

    $.ajax({
            type: "GET",
            url: "/nix/" + nixId,
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput);
            displayAddedFoods(dataOutput.foods);
            //            displayNutritionSearch(dataOutput.branded);            // displayActiveActivityResults(JSON.parse(resultsForJsonParse));
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayAddedFoods(dataMatches) {
    var buildTheHtmlOutput = "";
    var counter = 0;
    console.log(dataMatches);
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {
        if (counter < 5) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += '<li class="events">'; // each item needs to be a stand alone seperate form
            buildTheHtmlOutput += '<button type="submit" class="added-foods addToMealSubmitButton ">' + dataMatchesValue.food_name;
            buildTheHtmlOutput += '</button>';
            buildTheHtmlOutput += (dataMatchesValue.food_name);
            buildTheHtmlOutput += '</li>';
            counter++;
            var nutrientInfoObject = {
                name: dataMatchesValue.food_name,
                calories: dataMatchesValue.nf_calories,
                cholesterol: dataMatchesValue.nf_cholesterol,
                fiber: dataMatchesValue.nf_dietary_fiber,
                potassium: dataMatchesValue.nf_potassium,
                totalFat: dataMatchesValue.nf_total_fat,
                carbs: dataMatchesValue.nf_total_carbohydrate,
                protein: dataMatchesValue.nf_protein,
                sugar: dataMatchesValue.nf_sugars,
                sodium: dataMatchesValue.nf_sodium,
                satFat: dataMatchesValue.nf_saturated_fat,
            };

            $.ajax({
                    type: 'POST',
                    url: "/food-log/food-item",
                    dataType: 'json',
                    data: JSON.stringify(nutrientInfoObject),
                    contentType: 'application/json'
                })
                .done(function (result) {
                    console.log(result);
                    getFoodItems();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });

            console.log(nutrientInfoObject);
            // a for each check
            //            $('.selected-items').append(nutrientInfoObject.name); //to keep adding new ones
            //total nutrition list appending
            let appendTotalNutrition = '';
            appendTotalNutrition += '<li class="events">'; // each item needs to be a stand alone seperate form
            appendTotalNutrition += '<form class="addToMyMealForm">';
            appendTotalNutrition += '<input type="hidden" class="addToMealNameValue" value="' + dataMatchesValue.nix_item_id + '">';
            appendTotalNutrition += '<button type="submit" class="add-item addToMealSubmitButton " value="">-';
            appendTotalNutrition += '</button>';
            appendTotalNutrition += '</form>';
            appendTotalNutrition += (nutrientInfoObject.name);
            appendTotalNutrition += '</li>'



            let pCalories = (((checkValue(nutrientInfoObject.calories)) / 2000) * 100).toFixed(2);
            let pCarb = (((checkValue(nutrientInfoObject.carbs)) / 175) * 100).toFixed(2);
            let pSugar = (((checkValue(nutrientInfoObject.sugar)) / 25) * 100).toFixed(2);
            let pFiber = (((checkValue(nutrientInfoObject.fiber)) / 30) * 100).toFixed(2);
            let pFat = (((checkValue(nutrientInfoObject.totalFat)) / 200) * 100).toFixed(2);
            let pProtein = (((checkValue(nutrientInfoObject.protein)) / 200) * 100).toFixed(2);
            let pSodium = (((checkValue(nutrientInfoObject.sodium)) / 2000) * 100).toFixed(2);
            let pPotassium = (((checkValue(nutrientInfoObject.potassium)) / 5000) * 100).toFixed(2);

            //            console.log(pCalories);
            //            console.log(pCarb);
            //            console.log(pSugar);


            let macroProtein = ((checkValue(nutrientInfoObject.protein) * 4) / (checkValue(nutrientInfoObject.calories)) * 100).toFixed(2);
            let macroFat = ((checkValue(nutrientInfoObject.totalFat) * 9) / (checkValue(nutrientInfoObject.calories)) * 100).toFixed(2);
            let carbSugar = (nutrientInfoObject.carbs) + (nutrientInfoObject.sugar);
            console.log(carbSugar);
            let macroCarb = (((carbSugar * 4) / (checkValue(nutrientInfoObject.calories))) * 100).toFixed(2);
            console.log(macroCarb, macroFat, macroProtein, );

            $('#js-kcal-p').html(pCalories);
            $('#js-carb-p').html(pCarb);
            $('#js-sugar-p').html(pSugar);
            $('#js-fiber-p').html(pFiber);
            $('#js-fat-p').html(pFat);

            $('#js-protein-p').html(pProtein);
            $('#js-sodium-p').html(pSodium);
            $('#js-potassium-p').html(pPotassium);
            $('#js-macro-protein').html(macroProtein);
            $('#js-macro-fat').html(macroFat);
            $('#js-macro-carb').html(macroCarb);

            $('.selected-items ul').append(appendTotalNutrition);
            $('.current-food-item').html(nutrientInfoObject.name);
            $('#js-kcal').html(checkValue(nutrientInfoObject.calories));
            $('#js-carb').html(checkValue(nutrientInfoObject.carbs));
            $('#js-sugar').html(checkValue(nutrientInfoObject.sugar));
            $('#js-fiber').html(checkValue(nutrientInfoObject.fiber));
            $('#js-fat').html(checkValue(nutrientInfoObject.totalFat));
            $('#js-protein').html(checkValue(nutrientInfoObject.protein));
            $('#js-sodium').html(checkValue(nutrientInfoObject.sodium));
            $('#js-potassium').html(checkValue(nutrientInfoObject.potassium));
        };

    });
};

function checkValue(inputValue) {
    let outputValue = inputValue;
    if (inputValue == "") {
        outputValue = 0;
    }
    if (inputValue == undefined) {
        outputValue = 0;
    }
    if (inputValue == null) {
        outputValue = 0;
    }
    return outputValue;
}

function checkText(inputText) {
    let outputText = inputText;
    if (inputText == undefined) {
        outputText = "";
    }
    if (inputText == null) {
        outputText = "";
    }
    return outputText;
}

function checkURL(inputURL) {
    let outputURL = inputURL;
    if (inputURL == undefined) {
        outputURL = "/";
    }
    if (inputURL == null) {
        outputURL = "/";
    }
    return outputURL;
}

function displayNutritionSearch(dataMatches) {
    //create an empty variable to store one LI for each of the results
    var buildTheHtmlOutput = "";
    var counter = 0;
    console.log(dataMatches);
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {
        if (counter < 5) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += '<li class="events">'; // each item needs to be a stand alone seperate form
            buildTheHtmlOutput += '<form class="addToMyMealForm">';
            buildTheHtmlOutput += '<input type="hidden" class="addToMealNameValue" value="' + dataMatchesValue.nix_item_id + '">';
            buildTheHtmlOutput += '<button type="submit" class="add-item addToMealSubmitButton " value="">+';
            buildTheHtmlOutput += '</button>';
            buildTheHtmlOutput += '</form>';
            buildTheHtmlOutput += (dataMatchesValue.brand_name_item_name);
            buildTheHtmlOutput += '</li>';
            counter++;

        };
    });
    //use the HTML output to show it in the index.html
    $(".api-results").html(buildTheHtmlOutput);
};

function totalMealNutrition(dataMatches) {
    //create an empty variable to store one LI for each of the results
    let kcalTotal = 0;
    let carbTotal = 0;
    let sugarTotal = 0;
    let fiberTotal = 0;
    let fatTotal = 0;
    let proteinTotal = 0;
    let sodiumTotal = 0;
    let potassiumTotal = 0;
    console.log(dataMatches);

    $.each(dataMatches.foodLogResults, function (dataMatchesKey, dataMatchesValue) {
        kcalTotal += parseInt(checkValue(dataMatchesValue.calories));
        carbTotal += parseInt(checkValue(dataMatchesValue.carbs));
        fiberTotal += parseInt(checkValue(dataMatchesValue.fiber));
        sugarTotal += parseInt(checkValue(dataMatchesValue.sugar));
        fatTotal += parseInt(checkValue(dataMatchesValue.totalFat));
        proteinTotal += parseInt(checkValue(dataMatchesValue.protein));
        sodiumTotal += parseInt(checkValue(dataMatchesValue.sodium));
        potassiumTotal += parseInt(checkValue(dataMatchesValue.potassium));
        console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
    });
    console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
    let pCaloriesTotal = (((kcalTotal) / 2000) * 100).toFixed(2);
    let pCarbTotal = (((carbTotal) / 175) * 100).toFixed(2);
    let pSugarTotal = (((sugarTotal) / 25) * 100).toFixed(2);
    let pFiberTotal = (((fiberTotal) / 30) * 100).toFixed(2);
    let pFatTotal = (((fatTotal) / 200) * 100).toFixed(2);
    let pProteinTotal = (((proteinTotal) / 200) * 100).toFixed(2);
    let pSodiumTotal = (((sodiumTotal) / 2000) * 100).toFixed(2);
    let pPotassiumTotal = (((potassiumTotal) / 5000) * 100).toFixed(2);
    console.log(pCaloriesTotal, pCarbTotal, pSugarTotal, pFiberTotal, pFatTotal, pProteinTotal, pSodiumTotal, pPotassiumTotal);

    let macroProteinTotal = ((checkValue(proteinTotal) * 4) / (checkValue(kcalTotal)) * 100).toFixed(2);
    let macroFatTotal = ((checkValue(fatTotal) * 9) / (checkValue(kcalTotal)) * 100).toFixed(2);
    let carbSugarTotal = carbTotal + sugarTotal;
    let macroCarbTotal = (((carbSugarTotal * 4) / (checkValue(kcalTotal))) * 100).toFixed(2);
    console.log(carbTotal + sugarTotal, fatTotal, proteinTotal);
    console.log(macroCarbTotal, macroFatTotal, macroProteinTotal, );

    $("#js-total-kcal").html(kcalTotal);
    $("#js-total-carb").html(carbTotal);
    $("#js-total-sugar").html(sugarTotal);
    $("#js-total-fiber").html(fiberTotal);
    $("#js-total-fat").html(fatTotal);
    $("#js-total-protein").html(proteinTotal);
    $("#js-total-sodium").html(sodiumTotal);
    $("#js-total-potassium").html(potassiumTotal);

    $("#js-percent-kcal").html(pCaloriesTotal);
    $("#js-percent-carb").html(pCarbTotal);
    $("#js-percent-sugar").html(pSugarTotal);
    $("#js-percent-fiber").html(pFiberTotal);
    $("#js-percent-fat").html(pFatTotal);
    $("#js-percent-protein").html(pProteinTotal);
    $("#js-percent-sodium").html(pSodiumTotal);
    $("#js-percent-potassium").html(pPotassiumTotal);

    $("#js-macro-protein-total").html(macroProteinTotal);
    $("#js-macro-fat-total").html(macroFatTotal);
    $("#js-macro-carb-total").html(macroCarbTotal);
};


function getFoodItems() {
    $.ajax({
            type: "GET",
            url: "/get-requested-food-items/",
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput);
            totalMealNutrition(dataOutput);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}


//Step 2 - Use function and objects and find the triggers



$(document).ready(function () {
    //    containers to show: .landing 2
    //    containers to hide: .signup    .add-recipe    .nutrient-profile     .weekly    .saved-recipes   .main-page   .daily 6
    $('.signup').hide();
    $('.add-recipe').hide();
    $('.nutrient-profile').hide();
    $('.weekly').hide();
    $('.daily').hide();
    $('.saved-recipes').hide();
    $('.main-page').hide();
    $('.landing').show();


    console.log("initial logged in user = ", loggedInUser);
    var nowUnixTime = new Date().getTime() / 1000;
    if (loggedInUser != "") {
        var nowUnixTime = new Date().getTime() / 1000;
        checkLogedInUser(nowUnixTime, loggedInUser);
    }

    // USER FLOW 1: USER SIGNS UP FOR NEW ACCOUNT
    //    Register page user name and password input
    $('#js-create-account').on('click', function (event) {
        event.preventDefault();
        $('.title-header').hide();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.nutrient-profile').hide();
        $('.weekly').hide();
        $('.main-page').hide();
        $('.daily').hide();
        $('.saved-recipes').hide();
        $('.signup').show();

    });
    $('#register-form').on('submit keypress', function (event) {
        //if the event is a keypress and the key pressed has the code 13 (ENTER) OR if the event is a form submit ...
        if (event.type === 'keypress' && event.which === 13 || event.type === 'submit') {
            //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
            event.preventDefault();
            var username = $('#register-username-input').val();
            var password = $('#register-password-input').val();
            var verifyPassword = $('#register-verify-password-input').val();

            console.log(username, password, verifyPassword);

            if (username == '') {
                alert('Please enter a username');
            } else if (password == '') {
                alert('Please enter a password');
            } else if (password !== verifyPassword) {
                alert('Please make sure the passwords match');
            } else {
                console.log('success')
                registerUser(username, password);
                $('.add-recipe').hide();
                $('.nutrient-profile').hide();
                $('.weekly').hide();
                $('.daily').hide();
                $('.saved-recipes').hide();
                $('.signup').hide();
                $('.main-page').hide();
                $('.landing').show();

            }

        }
    });
    // User FLOW 2: Existing User signs in on landing page,
    $('#login-form').on('submit keypress', function (event) {
        event.preventDefault();
        if (event.type === 'keypress' && event.which === 13 || event.type === 'submit') {
            //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission

            var inputUname = $('#login-username-form').val();
            var inputPw = $('#login-password-form').val();
            console.log(inputUname, inputPw);
            // check for spaces, empty, undefined
            if ((!inputUname) || (inputUname.length < 1) || (inputUname.indexOf(' ') > 0)) {
                alert('Invalid username');
            } else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {
                alert('Invalid password');
            } else {
                console.log('Success');
                loginUser(inputUname, inputPw);
                //                checkLogedInUser(nowUnixTime, loggedInUser);
                $('.add-recipe').hide();
                $('.nutrient-profile').hide();
                $('.weekly').hide();
                $('.daily').hide();
                $('.saved-recipes').hide();
                $('.signup').hide();
                $('.landing').hide();
                $('.main-page').show();



            };


        };
    });

    //User then Logs in and is on Userpage -main flow
    //Jump to Daily Tracker --off shoot
    $('#js-daily-tracker').on('click', function (event) {
        event.preventDefault();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.nutrient-profile').hide();
        $('.signup').hide();
        $('.main-page').hide();
        $('.weekly').hide();
        $('.daily').show();
        $('.saved-recipes').show();
    });
    //Jump to Weekly tracker --off shoot
    $('#js-weekly-tracker').on('click', function (event) {
        event.preventDefault();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.nutrient-profile').hide();
        $('.daily').hide();
        $('.saved-recipes').hide();
        $('.signup').hide();
        $('.main-page').hide();
        $('.weekly').show();

    });
    $('.go-to-main').on('click', function (event) {
        event.preventDefault();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.daily').hide();
        $('.saved-recipes').hide();
        $('.signup').hide();
        $('.weekly').hide();
        $('.nutrient-profile').hide();
        $('.main-page').show();
    });
    //Jump to saved meals -main flow Look at this one
    $('#js-saved-meals').on('click', function (event) {
        event.preventDefault();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.daily').hide();
        $('.saved-recipes').hide();
        $('.signup').hide();
        $('.main-page').hide();
        $('.weekly').hide();
        $('.nutrient-profile').hide();
        $('.add-recipe').show();

    }); // from saved meals to add a meal
    $('#js-add-meal').on('click', function (event) {
        event.preventDefault();
        $('.landing').hide();
        $('.add-recipe').hide();
        $('.daily').hide();
        $('.saved-recipes').hide();
        $('.signup').hide();
        $('.main-page').hide();
        $('.weekly').hide();
        $('.nutrient-profile').hide();
        $('.add-recipe').show();

    });
    $('#js-save-meal').on('click', function (event) {
        event.preventDefault();
    });

    $(document).on('submit', '.addToMyMealForm', function (event) {
        event.preventDefault();
        let nixId = $(this).parent().find('.addToMealNameValue').val();
        console.log(nixId);
        $('.nutrient-profile').show();
        $('.weekly').show();
        ajaxNutritionFind(nixId);


    });

    $('#js-search-ingrediant').on('click', function (event) {
        event.preventDefault();
        let searchTerm = $('#js-search-field').val();
        if (searchTerm == '') {
            alert('Please enter a food item');
        } else {
            ajaxNutritionSearch(searchTerm);
        }

    });

});
