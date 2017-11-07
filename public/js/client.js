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
            document.location.href = "/index.html";

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
//Step 2 - Use function and objects and find the triggers

$(document).ready(function () {
    console.log("initial logged in user = ", loggedInUser);
    var nowUnixTime = new Date().getTime() / 1000;
    if (loggedInUser != "") {
        var nowUnixTime = new Date().getTime() / 1000;
        checkLogedInUser(nowUnixTime, loggedInUser);
    }

    // USER FLOW 1: USER SIGNS UP FOR NEW ACCOUNT
    //    Register page user name and password input

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
                checkLogedInUser(nowUnixTime, loggedInUser);
                document.location.href = "/userpage.html";
            };


        };
    });
});
