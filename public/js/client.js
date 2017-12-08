//Step 1 - Define Functions and Objects

var loggedInUser = "";

function displayErrors(errorText) {
    $('.display-error-container').show();
    $('.display-error-container').html(errorText);
    $('.display-error-container').fadeOut(5000);
}

function checkLogedInUser(nowUnixTime, loggedInUser) {
    console.log("current logged in user = ", loggedInUser);
}

function registerUser(username, password) {
    //    console.log('inside fn registerUser');
    //    console.log(username, password);

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
            //            console.log(result);
            displayErrors('Welcome to my Nutrition tracker, you may now sign in from the home page!');
            // go to main signin page
            //            backToHomePage();
            $('#js-signup').hide();


        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            displayErrors('Invalid username and password combination. Please check your username and password and try again.');
        });
}

function loginUser(inputUname, inputPw) {
    //    console.log('inside fn loginUser')
    const unamePwObject = {
        username: inputUname,
        password: inputPw
    };
    //    console.log(unamePwObject);
    $.ajax({
            type: "POST",
            url: "/users/login",
            dataType: 'json',
            data: JSON.stringify(unamePwObject),
            contentType: 'application/json'
        })
        .done(function (result) {
            loggedInUser = result;
            console.log(result);
            if (result == '') {
                displayErrors('Invalid Username/Password');

            } else {
                $('#js-user-welcome').html('Welcome ' + result);
                $('#js-username-breakfast').val(result);
                $('#js-username-lunch').val(result);
                $('#js-username-dinner').val(result);
            }

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            displayErrors('Invalid username and password combination. Please check your username and password and try again.');
            $('.signup').hide();
            $('.add-recipe').hide();
            $('.nutrient-profile').hide();
            $('.weekly').hide();
            $('.daily').hide();
            $('.saved-recipes').hide();
            $('.main-page').hide();
            $('.landing').show();


        });
}
//get request for user search term
function ajaxNutritionSearch(searchTerm) {

    $.ajax({
            type: "GET",
            url: "/ingredient/" + searchTerm,
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput.branded);
            if (dataOutput.branded.length == 0) {
                displayErrors('No results found try another name');
            } else { //            console.log(dataOutput.branded[0].brand_name);
                displayNutritionSearch(dataOutput.branded);
                // displayActiveActivityResults(JSON.parse(resultsForJsonParse));
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function ajaxNutritionFind(nixId) {

    $.ajax({
            type: "GET",
            url: "/nix/" + nixId,
            dataType: 'json',
        })
        .done(function (dataOutput) {
            //            console.log(dataOutput);
            displayAddedFoods(dataOutput.foods);
            //            displayNutritionSearch(dataOutput.branded);            // displayActiveActivityResults(JSON.parse(resultsForJsonParse));
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
//displays the nutrient profile when a food is added via + button
function displayAddedFoods(dataMatches) {
    var buildTheHtmlOutput = "";
    var counter = 0;
    //    console.log(dataMatches);
    //    console.log(loggedInUser);
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {

        if (counter < 5) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += '<li class="events">'; // each item needs to be a stand alone seperate form
            buildTheHtmlOutput += '<button type="submit" class="added-foods addToMealSubmitButton ">' + dataMatchesValue.food_name;
            buildTheHtmlOutput += '</button>';
            buildTheHtmlOutput += '<div class="brand-name">';
            buildTheHtmlOutput += (dataMatchesValue.food_name);
            buildTheHtmlOutput += '</div>';
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
                username: loggedInUser
            };

            $.ajax({
                    type: 'POST',
                    url: "/food-log/food-item",
                    dataType: 'json',
                    data: JSON.stringify(nutrientInfoObject),
                    contentType: 'application/json'
                })
                .done(function (result) {
                    //                    console.log(result);
                    getFoodItems();
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });

            //            console.log(nutrientInfoObject);
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
            appendTotalNutrition += '<div class="brand-name">';
            appendTotalNutrition += (nutrientInfoObject.name);
            appendTotalNutrition += '</div>';
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
            //            console.log(carbSugar);
            let macroCarb = (((carbSugar * 4) / (checkValue(nutrientInfoObject.calories))) * 100).toFixed(2);
            //            console.log(macroCarb, macroFat, macroProtein, );

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
//when user searches a term this populates the list with + button results
function displayNutritionSearch(dataMatches) {
    //create an empty variable to store one LI for each of the results
    var buildTheHtmlOutput = "";
    var counter = 0;
    //    console.log(dataMatches);
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {
        if (counter < 5) {
            //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
            buildTheHtmlOutput += '<li class="events">'; // each item needs to be a stand alone seperate form
            buildTheHtmlOutput += '<form class="addToMyMealForm">';
            buildTheHtmlOutput += '<input type="hidden" class="addToMealNameValue" value="' + dataMatchesValue.nix_item_id + '">';
            buildTheHtmlOutput += '<button type="submit" class="add-item addToMealSubmitButton " value="">+';
            buildTheHtmlOutput += '</button>';
            buildTheHtmlOutput += '</form>';
            buildTheHtmlOutput += '<div class="brand-name">';
            buildTheHtmlOutput += (dataMatchesValue.brand_name_item_name);
            buildTheHtmlOutput += '</div>';
            buildTheHtmlOutput += '</li>';
            counter++;

        };
    });
    //use the HTML output to show it in the index.html
    $(".api-results").html(buildTheHtmlOutput);
};
//appends user selected + items from search to save meal list
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
    let allocateItemToMealIDs = "";
    //    console.log(dataMatches);
    //    console.log(loggedInUser);

    let appendTotalNutrition = '';

    $('.selected-items ul').html("");
    $.each(dataMatches.foodLogResults, function (dataMatchesKey, dataMatchesValue) {
        if (dataMatchesValue.username == loggedInUser) {
            if (dataMatchesValue.meal == '') {

                kcalTotal += parseInt(checkValue(dataMatchesValue.calories));
                carbTotal += parseInt(checkValue(dataMatchesValue.carbs));
                fiberTotal += parseInt(checkValue(dataMatchesValue.fiber));
                sugarTotal += parseInt(checkValue(dataMatchesValue.sugar));
                fatTotal += parseInt(checkValue(dataMatchesValue.totalFat));
                proteinTotal += parseInt(checkValue(dataMatchesValue.protein));
                sodiumTotal += parseInt(checkValue(dataMatchesValue.sodium));
                potassiumTotal += parseInt(checkValue(dataMatchesValue.potassium));
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);


                appendTotalNutrition += '<li class="events">'; // each item needs to be a stand alone seperate form
                appendTotalNutrition += '<form class="deleteToMyMealForm">';
                appendTotalNutrition += '<input type="hidden" class="deleteToMealNameID" value="' + dataMatchesValue._id + '">';
                appendTotalNutrition += '<input type="hidden" class="deleteToMealNameValue" value="' + dataMatchesValue.name + '">';
                appendTotalNutrition += '<button type="submit" class="add-item deleteToMealSubmitButton " value="">-';
                appendTotalNutrition += '</button>';
                appendTotalNutrition += '</form>';
                appendTotalNutrition += '<div class="brand-name">';
                appendTotalNutrition += (dataMatchesValue.name);
                appendTotalNutrition += '</div>';
                appendTotalNutrition += '</li>'

                allocateItemToMealIDs += dataMatchesValue._id + ",";
            }
        };
    });

    $('.matching-results .allocateItemToMeal').val(allocateItemToMealIDs);

    $('.selected-items ul').append(appendTotalNutrition);


    //    console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
    let pCaloriesTotal = (((kcalTotal) / 2000) * 100).toFixed(2);
    let pCarbTotal = (((carbTotal) / 175) * 100).toFixed(2);
    let pSugarTotal = (((sugarTotal) / 25) * 100).toFixed(2);
    let pFiberTotal = (((fiberTotal) / 30) * 100).toFixed(2);
    let pFatTotal = (((fatTotal) / 200) * 100).toFixed(2);
    let pProteinTotal = (((proteinTotal) / 200) * 100).toFixed(2);
    let pSodiumTotal = (((sodiumTotal) / 2000) * 100).toFixed(2);
    let pPotassiumTotal = (((potassiumTotal) / 5000) * 100).toFixed(2);
    //    console.log(pCaloriesTotal, pCarbTotal, pSugarTotal, pFiberTotal, pFatTotal, pProteinTotal, pSodiumTotal, pPotassiumTotal);

    let macroProteinTotal = ((checkValue(proteinTotal) * 4) / (checkValue(kcalTotal)) * 100).toFixed(2);
    let macroFatTotal = ((checkValue(fatTotal) * 9) / (checkValue(kcalTotal)) * 100).toFixed(2);
    let carbSugarTotal = carbTotal + sugarTotal;
    let macroCarbTotal = (((carbSugarTotal * 4) / (checkValue(kcalTotal))) * 100).toFixed(2);
    //    console.log(carbTotal + sugarTotal, fatTotal, proteinTotal);
    //    console.log(macroCarbTotal, macroFatTotal, macroProteinTotal, );

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
    console.log('inside getFoodItems function');
    $.ajax({
            type: "GET",
            url: "/get-requested-food-items/",
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput);
            totalMealNutrition(dataOutput);
            updateMealTimeNutrition(dataOutput);

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}
// function to 0 out the values when delete all is run
function deleteAllMeals() {
    //zero lunch info
    $("#js-total-kcal-lunch").html('0');
    $("#js-total-carb-lunch").html('0');
    $("#js-total-sugar-lunch").html('0');
    $("#js-total-fiber-lunch").html('0');
    $("#js-total-fat-lunch").html('0');
    $("#js-total-protein-lunch").html('0');
    $("#js-total-sodium-lunch").html('0');
    $("#js-total-potassium-lunch").html('0');

    $("#js-percent-kcal-lunch").html('0');
    $("#js-percent-carb-lunch").html('0');
    $("#js-percent-sugar-lunch").html('0');
    $("#js-percent-fiber-lunch").html('0');
    $("#js-percent-fat-lunch").html('0');
    $("#js-percent-protein-lunch").html('0');
    $("#js-percent-sodium-lunch").html('0');
    $("#js-percent-potassium-lunch").html('0');

    $("#js-lunch-protein-macro").html('0');
    $("#js-lunch-fat-macro").html('0');
    $("#js-lunch-carb-macro").html('0');
    // zero dinner info
    $("#js-total-kcal-dinner").html('0');
    $("#js-total-carb-dinner").html('0');
    $("#js-total-sugar-dinner").html('0');
    $("#js-total-fiber-dinner").html('0');
    $("#js-total-fat-dinner").html('0');
    $("#js-total-protein-dinner").html('0');
    $("#js-total-sodium-dinner").html('0');
    $("#js-total-potassium-dinner").html('0');

    $("#js-percent-kcal-dinner").html('0');
    $("#js-percent-carb-dinner").html('0');
    $("#js-percent-sugar-dinner").html('0');
    $("#js-percent-fiber-dinner").html('0');
    $("#js-percent-fat-dinner").html('0');
    $("#js-percent-protein-dinner").html('0');
    $("#js-percent-sodium-dinner").html('0');
    $("#js-percent-potassium-dinner").html('0');

    $("#js-dinner-protein-macro").html('0');
    $("#js-dinner-fat-macro").html('0');
    $("#js-dinner-carb-macro").html('0');
    //zero breakfast info
    $("#js-total-kcal-breakfast").html('0');
    $("#js-total-carb-breakfast").html('0');
    $("#js-total-sugar-breakfast").html('0');
    $("#js-total-fiber-breakfast").html('0');
    $("#js-total-fat-breakfast").html('0');
    $("#js-total-protein-breakfast").html('0');
    $("#js-total-sodium-breakfast").html('0');
    $("#js-total-potassium-breakfast").html('0');

    $("#js-percent-kcal-breakfast").html('0');
    $("#js-percent-carb-breakfast").html('0');
    $("#js-percent-sugar-breakfast").html('0');
    $("#js-percent-fiber-breakfast").html('0');
    $("#js-percent-fat-breakfast").html('0');
    $("#js-percent-protein-breakfast").html('0');
    $("#js-percent-sodium-breakfast").html('0');
    $("#js-percent-potassium-breakfast").html('0');

    $("#js-breakfast-protein-macro").html('0');
    $("#js-breakfast-fat-macro").html('0');
    $("#js-breakfast-carb-macro").html('0');

    $("#total-kcal").html('0');
    $("#total-carb").html('0');
    $("#total-sugar").html('0');
    $("#total-fiber").html('0');
    $("#total-fat").html('0');
    $("#total-protein").html('0');
    $("#total-sodium").html('0');
    $("#total-potassium").html('0');

    $("#daily-protein").html('0');
    $("#daily-fat").html('0');
    $("#daily-carb").html('0');

};
//when meal is saved as B L OR D, sends user to daily page and updates the values for BLD.
function updateMealTimeNutrition(dataMatches) {
    //create an empty variable to store one LI for each of the results
    let kcalTotalBreakfast = 0;
    let carbTotalBreakfast = 0;
    let sugarTotalBreakfast = 0;
    let fiberTotalBreakfast = 0;
    let fatTotalBreakfast = 0;
    let proteinTotalBreakfast = 0;
    let sodiumTotalBreakfast = 0;
    let potassiumTotalBreakfast = 0;

    let kcalTotalLunch = 0;
    let carbTotalLunch = 0;
    let sugarTotalLunch = 0;
    let fiberTotalLunch = 0;
    let fatTotalLunch = 0;
    let proteinTotalLunch = 0;
    let sodiumTotalLunch = 0;
    let potassiumTotalLunch = 0;

    let kcalTotalDinner = 0;
    let carbTotalDinner = 0;
    let sugarTotalDinner = 0;
    let fiberTotalDinner = 0;
    let fatTotalDinner = 0;
    let proteinTotalDinner = 0;
    let sodiumTotalDinner = 0;
    let potassiumTotalDinner = 0;

    let kcalTotalDaily = 0;
    let carbTotalDaily = 0;
    let sugarTotalDaily = 0;
    let fiberTotalDaily = 0;
    let fatTotalDaily = 0;
    let proteinTotalDaily = 0;
    let sodiumTotalDaily = 0;
    let potassiumTotalDaily = 0;
    console.log(dataMatches);
    //    console.log(loggedInUser);
    $.each(dataMatches.foodLogResults, function (dataMatchesKey, dataMatchesValue) {
        if (dataMatchesValue.username == loggedInUser) {

            //            console.log(kcalTotalDaily, "line 435 dailykcal");
            if (dataMatchesValue.meal == 'lunch') {
                //                console.log('update for lunch: ', dataMatchesValue);

                kcalTotalLunch += parseInt(checkValue(dataMatchesValue.calories));
                carbTotalLunch += parseInt(checkValue(dataMatchesValue.carbs));
                fiberTotalLunch += parseInt(checkValue(dataMatchesValue.fiber));
                sugarTotalLunch += parseInt(checkValue(dataMatchesValue.sugar));
                fatTotalLunch += parseInt(checkValue(dataMatchesValue.totalFat));
                proteinTotalLunch += parseInt(checkValue(dataMatchesValue.protein));
                sodiumTotalLunch += parseInt(checkValue(dataMatchesValue.sodium));
                potassiumTotalLunch += parseInt(checkValue(dataMatchesValue.potassium));
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
                //display data for
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
                let pCaloriesTotalLunch = (((kcalTotalLunch) / 2000) * 100).toFixed(2);
                let pCarbTotalLunch = (((carbTotalLunch) / 175) * 100).toFixed(2);
                let pSugarTotalLunch = (((sugarTotalLunch) / 25) * 100).toFixed(2);
                let pFiberTotalLunch = (((fiberTotalLunch) / 30) * 100).toFixed(2);
                let pFatTotalLunch = (((fatTotalLunch) / 200) * 100).toFixed(2);
                let pProteinTotalLunch = (((proteinTotalLunch) / 200) * 100).toFixed(2);
                let pSodiumTotalLunch = (((sodiumTotalLunch) / 2000) * 100).toFixed(2);
                let pPotassiumTotalLunch = (((potassiumTotalLunch) / 5000) * 100).toFixed(2);
                //                console.log(pCaloriesTotal, pCarbTotal, pSugarTotal, pFiberTotal, pFatTotal, pProteinTotal, pSodiumTotal, pPotassiumTotal);

                let macroProteinTotalLunch = ((checkValue(proteinTotalLunch) * 4) / (checkValue(kcalTotalLunch)) * 100).toFixed(2);
                let macroFatTotalLunch = ((checkValue(fatTotalLunch) * 9) / (checkValue(kcalTotalLunch)) * 100).toFixed(2);
                let carbSugarTotalLunch = carbTotalLunch + sugarTotalLunch;
                let macroCarbTotalLunch = (((carbSugarTotalLunch * 4) / (checkValue(kcalTotalLunch))) * 100).toFixed(2);
                //                console.log(carbTotal + sugarTotal, fatTotal, proteinTotal);
                //                console.log(macroCarbTotal, macroFatTotal, macroProteinTotal, );
                //output to  location
                $("#js-total-kcal-lunch").html(kcalTotalLunch);
                $("#js-total-carb-lunch").html(carbTotalLunch);
                $("#js-total-sugar-lunch").html(sugarTotalLunch);
                $("#js-total-fiber-lunch").html(fiberTotalLunch);
                $("#js-total-fat-lunch").html(fatTotalLunch);
                $("#js-total-protein-lunch").html(proteinTotalLunch);
                $("#js-total-sodium-lunch").html(sodiumTotalLunch);
                $("#js-total-potassium-lunch").html(potassiumTotalLunch);

                $("#js-percent-kcal-lunch").html(pCaloriesTotalLunch);
                $("#js-percent-carb-lunch").html(pCarbTotalLunch);
                $("#js-percent-sugar-lunch").html(pSugarTotalLunch);
                $("#js-percent-fiber-lunch").html(pFiberTotalLunch);
                $("#js-percent-fat-lunch").html(pFatTotalLunch);
                $("#js-percent-protein-lunch").html(pProteinTotalLunch);
                $("#js-percent-sodium-lunch").html(pSodiumTotalLunch);
                $("#js-percent-potassium-lunch").html(pPotassiumTotalLunch);

                $("#js-lunch-protein-macro").html(macroProteinTotalLunch);
                $("#js-lunch-fat-macro").html(macroFatTotalLunch);
                $("#js-lunch-carb-macro").html(macroCarbTotalLunch);

            };
            //            console.log(kcalTotalDaily, "line 435 dailykcal");
            if (dataMatchesValue.meal == 'dinner') {
                //                console.log('update for dinner: ', dataMatchesValue);

                kcalTotalDinner += parseInt(checkValue(dataMatchesValue.calories));
                carbTotalDinner += parseInt(checkValue(dataMatchesValue.carbs));
                fiberTotalDinner += parseInt(checkValue(dataMatchesValue.fiber));
                sugarTotalDinner += parseInt(checkValue(dataMatchesValue.sugar));
                fatTotalDinner += parseInt(checkValue(dataMatchesValue.totalFat));
                proteinTotalDinner += parseInt(checkValue(dataMatchesValue.protein));
                sodiumTotalDinner += parseInt(checkValue(dataMatchesValue.sodium));
                potassiumTotalDinner += parseInt(checkValue(dataMatchesValue.potassium));
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
                //display data for
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
                let pCaloriesTotalDinner = (((kcalTotalDinner) / 2000) * 100).toFixed(2);
                let pCarbTotalDinner = (((carbTotalDinner) / 175) * 100).toFixed(2);
                let pSugarTotalDinner = (((sugarTotalDinner) / 25) * 100).toFixed(2);
                let pFiberTotalDinner = (((fiberTotalDinner) / 30) * 100).toFixed(2);
                let pFatTotalDinner = (((fatTotalDinner) / 200) * 100).toFixed(2);
                let pProteinTotalDinner = (((proteinTotalDinner) / 200) * 100).toFixed(2);
                let pSodiumTotalDinner = (((sodiumTotalDinner) / 2000) * 100).toFixed(2);
                let pPotassiumTotalDinner = (((potassiumTotalDinner) / 5000) * 100).toFixed(2);
                //                console.log(pCaloriesTotal, pCarbTotal, pSugarTotal, pFiberTotal, pFatTotal, pProteinTotal, pSodiumTotal, pPotassiumTotal);

                let macroProteinTotalDinner = ((checkValue(proteinTotalDinner) * 4) / (checkValue(kcalTotalDinner)) * 100).toFixed(2);
                let macroFatTotalDinner = ((checkValue(fatTotalDinner) * 9) / (checkValue(kcalTotalDinner)) * 100).toFixed(2);
                let carbSugarTotalDinner = carbTotalDinner + sugarTotalDinner;
                let macroCarbTotalDinner = (((carbSugarTotalDinner * 4) / (checkValue(kcalTotalDinner))) * 100).toFixed(2);
                //                console.log(carbTotal + sugarTotal, fatTotal, proteinTotal);
                //                console.log(macroCarbTotal, macroFatTotal, macroProteinTotal, );

                $("#js-total-kcal-dinner").html(kcalTotalDinner);
                $("#js-total-carb-dinner").html(carbTotalDinner);
                $("#js-total-sugar-dinner").html(sugarTotalDinner);
                $("#js-total-fiber-dinner").html(fiberTotalDinner);
                $("#js-total-fat-dinner").html(fatTotalDinner);
                $("#js-total-protein-dinner").html(proteinTotalDinner);
                $("#js-total-sodium-dinner").html(sodiumTotalDinner);
                $("#js-total-potassium-dinner").html(potassiumTotalDinner);

                $("#js-percent-kcal-dinner").html(pCaloriesTotalDinner);
                $("#js-percent-carb-dinner").html(pCarbTotalDinner);
                $("#js-percent-sugar-dinner").html(pSugarTotalDinner);
                $("#js-percent-fiber-dinner").html(pFiberTotalDinner);
                $("#js-percent-fat-dinner").html(pFatTotalDinner);
                $("#js-percent-protein-dinner").html(pProteinTotalDinner);
                $("#js-percent-sodium-dinner").html(pSodiumTotalDinner);
                $("#js-percent-potassium-dinner").html(pPotassiumTotalDinner);

                $("#js-dinner-protein-macro").html(macroProteinTotalDinner);
                $("#js-dinner-fat-macro").html(macroFatTotalDinner);
                $("#js-dinner-carb-macro").html(macroCarbTotalDinner);

            };
            //            console.log(kcalTotalDaily, "line 435 dailykcal");
            if (dataMatchesValue.meal == 'breakfast') {
                //                console.log('update for breakfast: ', dataMatchesValue);

                kcalTotalBreakfast += parseInt(checkValue(dataMatchesValue.calories));
                carbTotalBreakfast += parseInt(checkValue(dataMatchesValue.carbs));
                fiberTotalBreakfast += parseInt(checkValue(dataMatchesValue.fiber));
                sugarTotalBreakfast += parseInt(checkValue(dataMatchesValue.sugar));
                fatTotalBreakfast += parseInt(checkValue(dataMatchesValue.totalFat));
                proteinTotalBreakfast += parseInt(checkValue(dataMatchesValue.protein));
                sodiumTotalBreakfast += parseInt(checkValue(dataMatchesValue.sodium));
                potassiumTotalBreakfast += parseInt(checkValue(dataMatchesValue.potassium));
                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);

                //                console.log(kcalTotal, carbTotal, sugarTotal, fiberTotal, fatTotal, proteinTotal, sodiumTotal, potassiumTotal);
                let pCaloriesTotalBreakfast = (((kcalTotalBreakfast) / 2000) * 100).toFixed(2);
                let pCarbTotalBreakfast = (((carbTotalBreakfast) / 175) * 100).toFixed(2);
                let pSugarTotalBreakfast = (((sugarTotalBreakfast) / 25) * 100).toFixed(2);
                let pFiberTotalBreakfast = (((fiberTotalBreakfast) / 30) * 100).toFixed(2);
                let pFatTotalBreakfast = (((fatTotalBreakfast) / 200) * 100).toFixed(2);
                let pProteinTotalBreakfast = (((proteinTotalBreakfast) / 200) * 100).toFixed(2);
                let pSodiumTotalBreakfast = (((sodiumTotalBreakfast) / 2000) * 100).toFixed(2);
                let pPotassiumTotalBreakfast = (((potassiumTotalBreakfast) / 5000) * 100).toFixed(2);
                //                console.log(pCaloriesTotal, pCarbTotal, pSugarTotal, pFiberTotal, pFatTotal, pProteinTotal, pSodiumTotal, pPotassiumTotal);

                let macroProteinTotalBreakfast = ((checkValue(proteinTotalBreakfast) * 4) / (checkValue(kcalTotalBreakfast)) * 100).toFixed(2);
                let macroFatTotalBreakfast = ((checkValue(fatTotalBreakfast) * 9) / (checkValue(kcalTotalBreakfast)) * 100).toFixed(2);
                let carbSugarTotalBreakfast = carbTotalBreakfast + sugarTotalBreakfast;
                let macroCarbTotalBreakfast = (((carbSugarTotalBreakfast * 4) / (checkValue(kcalTotalBreakfast))) * 100).toFixed(2);
                //                console.log(carbTotal + sugarTotal, fatTotal, proteinTotal);
                //                console.log(macroCarbTotal, macroFatTotal, macroProteinTotal, );

                $("#js-total-kcal-breakfast").html(kcalTotalBreakfast);
                $("#js-total-carb-breakfast").html(carbTotalBreakfast);
                $("#js-total-sugar-breakfast").html(sugarTotalBreakfast);
                $("#js-total-fiber-breakfast").html(fiberTotalBreakfast);
                $("#js-total-fat-breakfast").html(fatTotalBreakfast);
                $("#js-total-protein-breakfast").html(proteinTotalBreakfast);
                $("#js-total-sodium-breakfast").html(sodiumTotalBreakfast);
                $("#js-total-potassium-breakfast").html(potassiumTotalBreakfast);

                $("#js-percent-kcal-breakfast").html(pCaloriesTotalBreakfast);
                $("#js-percent-carb-breakfast").html(pCarbTotalBreakfast);
                $("#js-percent-sugar-breakfast").html(pSugarTotalBreakfast);
                $("#js-percent-fiber-breakfast").html(pFiberTotalBreakfast);
                $("#js-percent-fat-breakfast").html(pFatTotalBreakfast);
                $("#js-percent-protein-breakfast").html(pProteinTotalBreakfast);
                $("#js-percent-sodium-breakfast").html(pSodiumTotalBreakfast);
                $("#js-percent-potassium-breakfast").html(pPotassiumTotalBreakfast);

                $("#js-breakfast-protein-macro").html(macroProteinTotalBreakfast);
                $("#js-breakfast-fat-macro").html(macroFatTotalBreakfast);
                $("#js-breakfast-carb-macro").html(macroCarbTotalBreakfast);


            }

        };

    });
    kcalTotalDaily += kcalTotalBreakfast;
    carbTotalDaily += carbTotalBreakfast;
    sugarTotalDaily += sugarTotalBreakfast;
    fiberTotalDaily += fiberTotalBreakfast;
    fatTotalDaily += fatTotalBreakfast;
    proteinTotalDaily += proteinTotalBreakfast;
    sodiumTotalDaily += sodiumTotalBreakfast;
    potassiumTotalDaily += potassiumTotalBreakfast;

    kcalTotalDaily += kcalTotalDinner;
    carbTotalDaily += carbTotalDinner;
    sugarTotalDaily += sugarTotalDinner;
    fiberTotalDaily += fiberTotalDinner;
    fatTotalDaily += fatTotalDinner;
    proteinTotalDaily += proteinTotalDinner;
    sodiumTotalDaily += sodiumTotalDinner;
    potassiumTotalDaily += potassiumTotalDinner;

    kcalTotalDaily += kcalTotalLunch;
    carbTotalDaily += carbTotalLunch;
    sugarTotalDaily += sugarTotalLunch;
    fiberTotalDaily += fiberTotalLunch;
    fatTotalDaily += fatTotalLunch;
    proteinTotalDaily += proteinTotalLunch;
    sodiumTotalDaily += sodiumTotalLunch;
    potassiumTotalDaily += potassiumTotalLunch;

    dailyProtein = ((checkValue(proteinTotalDaily) * 4) / (checkValue(kcalTotalDaily)) * 100).toFixed(2);
    dailyFat = ((checkValue(fatTotalDaily) * 9) / (checkValue(kcalTotalDaily)) * 100).toFixed(2);
    dailyCarb = ((checkValue(carbTotalDaily) * 4) / (checkValue(kcalTotalDaily)) * 100).toFixed(2);


    //    console.log(kcalTotalDaily, "line 435 dailykcal");
    $("#total-kcal").html(kcalTotalDaily);
    $("#total-carb").html(carbTotalDaily);
    $("#total-sugar").html(sugarTotalDaily);
    $("#total-fiber").html(fiberTotalDaily);
    $("#total-fat").html(fatTotalDaily);
    $("#total-protein").html(proteinTotalDaily);
    $("#total-sodium").html(sodiumTotalDaily);
    $("#total-potassium").html(potassiumTotalDaily);

    $("#daily-protein").html(dailyProtein);
    $("#daily-fat").html(dailyFat);
    $("#daily-carb").html(dailyCarb);




};
//Step 2 - Use function and objects and find the triggers

$(document).ready(function () {
    $('.signup').hide();
    $('.add-recipe').hide();
    $('.nutrient-profile').hide();
    $('.weekly').hide();
    $('.daily').hide();
    $('.saved-recipes').hide();
    $('.main-page').hide();
    $('.display-error-container').hide()
    $('.landing').show();
    //    console.log("initial logged in user = ", loggedInUser);
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

                displayErrors('Please enter a username');

            } else if (password == '') {

                displayErrors('Please enter a password');

            } else if (password !== verifyPassword) {

                displayErrors('Please make sure the passwords match');

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
    //breakfast lunch dinner tracker and listeners
    $('#js-meal-time').on('click', function (event) {
        event.preventDefault;
    });
    $('#js-save-meal').on('click', function (event) {
        event.preventDefault();
        let selectMealTime = $('#js-dropdown-value').val();
        let selectedItemsIDs = $('.allocateItemToMeal').val();
        //        console.log(selectMealTime, selectedItemsIDs);

        const allocateItemsToMealObj = {
            mealTime: selectMealTime,
            itemsId: selectedItemsIDs
        };

        $.ajax({
                type: 'PUT',
                url: '/allocate-item-to-meal',
                dataType: 'json',
                data: JSON.stringify(allocateItemsToMealObj),
                contentType: 'application/json'
            })
            .done(function (result) {
                getFoodItems();
                $('.signup').hide();
                $('.add-recipe').hide();
                $('.nutrient-profile').hide();
                $('.weekly').hide();
                $('.main-page').hide();
                $('.landing').hide();
                $('.daily').show();
                $('.saved-recipes').show();



            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    });

    // User FLOW 2: Existing User signs in on landing page,
    $('#login-form').on('submit keypress', function (event) {
        event.preventDefault();
        if (event.type === 'keypress' && event.which === 13 || event.type === 'submit') {
            //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
            var inputUname = $('#login-username-form').val();
            var inputPw = $('#login-password-form').val();
            //            console.log(inputUname, inputPw);
            // check for spaces, empty, undefined
            if ((!inputUname) || (inputUname.length < 1) || (inputUname.indexOf(' ') > 0)) {

                displayErrors('Invalid Username');

            } else if ((!inputPw) || (inputPw.length < 1) || (inputPw.indexOf(' ') > 0)) {

                displayErrors('Invalid Password');

            } else {
                //                console.log('Success');
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
                getFoodItems();
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
        $('.saved-recipes').show();
        $('.daily').show();

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
        $('.nutrient-profile').hide();
        $('.weekly').show();
        $('.add-recipe').show();

    });

    $(document).on('submit', '.addToMyMealForm', function (event) {
        event.preventDefault();
        let nixId = $(this).parent().find('.addToMealNameValue').val();
        //        console.log(nixId);
        $('.nutrient-profile').show();
        $('.weekly').show();
        ajaxNutritionFind(nixId);


    });
    $(document).on('submit', '.deleteToMyMealForm', function (event) {
        event.preventDefault();
        let deleteId = $(this).parent().find('.deleteToMealNameID').val();
        //        console.log(deleteId);
        if (confirm('Are you sure you want to delete this food item?') === true) {
            $.ajax({
                method: 'DELETE',
                url: '/nix/' + deleteId,
                success: getFoodItems
            });
        };
    });

    $('#js-delete-all').on('click', function (event) {
        let username = $('#js-username-lunch').val();
        if (confirm('Are you sure you want to delete your meal Information') === true) {
            $.ajax({
                method: 'DELETE',
                url: '/delete-nutrition-data/' + username,
                success: deleteAllMeals
            });
        };

    });

    $('#js-search-ingrediant').on('click', function (event) {
        event.preventDefault();
        let searchTerm = $('#js-search-field').val();
        if (searchTerm == '') {
            displayErrors('Please enter a food item');
        } else {
            ajaxNutritionSearch(searchTerm);
        }

    });
    $('#js-logout-button').on('click', function (event) {
        event.preventDefault();
        location.reload("/");
    })

});
