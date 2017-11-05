//Step 1 - Define Functions and Objects
function registerUser(userName, password) {
    console.log('inside reg-user');
    console.log(userName, password);

    const unamePwObject = {
        username: userName,
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
            // show the signout link in header as soon as user is signed in
            //        $('#js-signout-link').show();
            //        if (newUserToggle === true) {
            //            showAddPage();
            //        } else {
            //            showHomePage();
            //        }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Invalid username and password combination. Pleae check your username and password and try again.');
        });
}

//Step 2 - Use function and objects and find the triggers

$(document).ready(function () {
    $('#register-form').on('submit keypress', function (event) {
        //if the event is a keypress and the key pressed has the code 13 (ENTER) OR if the event is a form submit ...
        if (event.type === 'keypress' && event.which === 13 || event.type === 'submit') {
            //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
            event.preventDefault();
            var userName = $('#register-username-input').val();
            var password = $('#register-password-input').val();
            var verifyPassword = $('#register-verify-password-input').val();

            console.log(userName, password, verifyPassword);

            if (userName == '') {
                alert('Please enter a username');
            } else if (password == '') {
                alert('Please enter a password');
            } else if (password !== verifyPassword) {
                alert('Please make sure the passwords match');
            } else {
                console.log('success')
                registerUser(userName, password);
            }
            // username and password registration validation
            //            var shoppingItem = {
            //                name: itemName,
            //                checked: false
            //            }
            //            if (itemName) {
            //                /*activate function called addItem()*/
            //                addItem(state, shoppingItem);
            //                /*and reder the list with the new item in it*/
            //                renderList(state);
            //            }
        }
    });


});
