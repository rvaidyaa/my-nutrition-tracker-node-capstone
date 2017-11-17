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

            console.log(nutrientInfoObject);
            // a for each check
            $('.current-food-item').html(nutrientInfoObject.name);
            $('#js-kcal').html(nutrientInfoObject.calories);
            $('#js-carb').html(nutrientInfoObject.carbs);
            $('#js-sugar').html(nutrientInfoObject.sugar);
            $('#js-fiber').html(nutrientInfoObject.fiber);
            $('#js-fat').html(nutrientInfoObject.totalFat);
            $('#js-protein').html(nutrientInfoObject.protein);
            $('#js-sodium').html(nutrientInfoObject.sodium);
            if (nutrientInfoObject.potassium == null) {
                nutrientInfoObject.potassium = 0;
                $('#js-potassium').html(nutrientInfoObject.potassium);
            } else {
                $('#js-potassium').html(nutrientInfoObject.potassium);
            };
        };

    });
};

function buildTheMealOutput(nutrientInfoObject) {

};

function displayNutritionSearch(dataMatches) {
    //create an empty variable to store one LI for each of the results
    var buildTheHtmlOutput = "";
    var counter = 0;
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


//Step 2 - Use function and objects and find the triggers



$(document).ready(function () {
    //    containers to show: .landing 2
    //    containers to hide: .signup    .add-recipe    .nutrient-profile     .weekly    .saved-recipes   .main-page   .daily 6
    $('.signup').hide();
    //    $('.add-recipe').hide();
    $('.nutrient-profile').hide();
    //    $('.weekly').hide();
    //    $('.daily').hide();
    //    $('.saved-recipes').hide();
    //    $('.landing').hide();
    $('.main-page').show();

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
    //Jump to saved meals -main flow
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
    // Save a recipe and view nutrient profile, more needs to be done here
    //    $('#js-save-nutrient-profile').on('click', function (event) {
    //        event.preventDefault();
    //        var recipeName = '';
    //        recipeName = $('#js-recipe-name').val();
    //        console.log(recipeName);
    //        if (recipeName === '') {
    //            alert('Please enter a recipe name');
    //        } else {
    //            recipeName = $('#js-recipe-name').val();
    //            document.location.href = "/nutrient.html"
    //            console.log(recipeName);
    //        };
    //    });
    $(document).on('submit', '.addToMyMealForm', function (event) {
        event.preventDefault();
        let nixId = $(this).parent().find('.addToMealNameValue').val();
        console.log(nixId);
        $('.nutrient-profile').show();
        ajaxNutritionFind(nixId);


    });
    $('#js-search-ingrediant').on('click', function (event) {
        event.preventDefault();

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
