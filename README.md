# My Nutrition Tracker Node Capstone
Node capstone for the thinkful course.

My nutritional tracker is an app designed with nutrition in mind. You can add custom meals and portions and the application will track the micro and macro nutrients you consume. You can even get daily totals! Uses an external api call to nutritionx to get macro nutrient details for specific food items from common restaurants.

## Screenshots
![Landing page screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/github-images/landingpage.png)
![Account setup screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/github-images/signup.png)
![User homepage screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/github-images/dailyview.png)
![User add meal screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/github-images/addmealpage.png)




## Initial UX
User Stories
AS A VISITOR, NOT LOGGED IN

* As an initial visitor to the page, I want to land on the web page and see what the page is about so I can understand what the app is and does and decide whether or not to create an account to be able to use the app.

* As a visitor, I want to create a new account so that I can use the app.
(LANDING PAGE--wireframe will have title, logo, a few details about logging in and what the app is about)

* As a visitor who has already created an account, I want to log in so that I can access my account.

![UI Flow handwritten draft](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/Wireframe/landing.jpg)


![UI Flow handwritten draft](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/Wireframe/signup.jpg)


AS A LOGGED-IN USER

## Initial UX (mine)
User Stories

As a visitor, not logged in,

* As a visitor, I want to see what the application is about
* As a visitor I want to see if i am interested in making an account
* As a visitor, I want a simple sign up page.

As a logged in user

* As a user, I want be able to add meals
* As a user I would like a overall view of what I eat
* As a user I want to see the macro and micro nutrient totals each day
![UI Flow handwritten draft](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/Wireframe/mainpage.jpg)

When I add meals:

* As a user, I want to be able to add ingrediants in name and quantity
* As a user, I want to save my meals
* As a user, I want to be able to view the nutrition profile of the meal in my saved meals

* As a user, when i click on the nutrition profile i want a it easily readible with most relevant information at the top.
* As a user, when i view my weekly totals I want averages
* As a user I want my averages displayed in my weekly totals
* As a user I want the micro/macro nutrients available
![UI Flow handwritten draft](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/Wireframe/addmeal.jpg)


## Working Prototype
Find a working prototype with Node at http://my-nutrition-tracker-node.herokuapp.com/ .


## Technical

### Front End

* HTML5
* CSS3
* JavaScript
* jQuery

### Back End

* Node.js
* Express.js
* MongoDB
* Mongoose
* mLab database
"https://mochajs.org/"  "http://chaijs.com/"

### Responsive

* The app is responsive and optimized for both desktop and mobile viewing and use.

### Security

* User passwords are encrypted using "https://github.com/dcodeIO/bcrypt.js"

## API Documentation
API endpoints for the back end include:
* POST to '/users/create' for creating a new user
* POST to '/signin' to sign in an existing user
* POST to '/new/create' to add an achievement to a user's list of accomplishments
* PUT to '/allocate-item-to-meal' to categorize a meal to breakfast lunch or dinner
* GET to '/ingredient/:name' to search external api for user food search term
* GET to '/nix/:number' when a user selects a food item to add, this makes a external api call to get specifics on the food item
* DELETE to '/nix/:number' to delete a single food item from the meal
* DELETE to /delete-nutrition-data/:username' to delete all a users meals

## Development Roadmap
Planned additional features and improvements will allow users to:
* Weekly tracker
* Change password
* Update email address
