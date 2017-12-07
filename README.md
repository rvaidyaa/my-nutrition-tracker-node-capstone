# My Nutrition Tracker Node Capstone
Node capstone for the thinkful course. (like line 5).


My nutritional tracker is an app designed with cooking and nutrition in mind. You can add custom meals and portions and the application will track the micro and macro nutrients you consume. You can even get weekly and daily totals!

## Screenshots
![Landing page screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/public/img/njl01.png)
![Account setup screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/public/img/njl02.png)
![User homepage screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/public/img/njl03.png)
![Achievement timeline screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/public/img/njl04.png)
![Skills word cloud screen shot](https://github.com/rvaidyaa/my-nutrition-tracker-node-capstone/blob/master/public/img/njl05.png)

## Use Case
Not Just Luck is for anyone who struggles with impostor syndrome and would like a centralized place to record and reflect upon their accomplishments and what it took to achieve them. Not Just Luck is like a good friend who reminds you of your strengths when you forget.

## Initial UX
User Stories
AS A VISITOR, NOT LOGGED IN

* As an initial visitor to the page, I want to land on the web page and see what the page is about so I can understand what the app is and does and decide whether or not to create an account to be able to use the app.
* //!!As a visitor, I want to create a new account so that I can use the app.
(LANDING PAGE--wireframe will have title, logo, a few details about logging in and what the app is about)
![UI Flow handwritten draft](https://github.com/Marjona6/not-just-luck-thinkful-full-stack-capstone/blob/master/public/img/wf00.jpg)

* As a visitor who has already created an account, I want to log in so that I can access my account.

AS A LOGGED-IN USER

![UI Flow handwritten draft](https://github.com/Marjona6/not-just-luck-thinkful-full-stack-capstone/blob/master/public/img/wf04.jpg)

![UI Flow handwritten draft](https://github.com/Marjona6/not-just-luck-thinkful-full-stack-capstone/blob/master/public/img/wf01.jpg)
![UI Flow handwritten draft](https://github.com/Marjona6/not-just-luck-thinkful-full-stack-capstone/blob/master/public/img/wf02.jpg)
![UI Flow handwritten draft](https://github.com/Marjona6/not-just-luck-thinkful-full-stack-capstone/blob/master/public/img/wf03.jpg)
//
## Initial UX (mine)
User Stories

As a visitor, not logged in,

*As a visitor, I want to see what the application is about
*As a visitor I want to see if i am interested in making an account
*As a visitor who has made an account I would like to sign in to access my account.
*As a visitor, I want a simple sign up page.

As a logged in user

*As a user, I want be able to add meals
*As a user I would like a overall view of what I eat
*As a user I want to see the macro and micro nutrient totals each day
*As a user I want a link to a weekly summary

When I add meals:

*As a user, I want to be able to add ingrediants in name and quantity
*As a user, I want to save my recipes
*As a user, I want to be able to upload a picture of the recipe
*As a user, I want to be able to view the nutrition profile of the meal in my saved recipes

*As a user, when i click on the nutrition profile i want a it easily readible with most relevant information at the top.
*As a user, when i view my weekly totals I want averages
*As a user I want my averages displayed in my weekly totals
*As a user I want the micro/macro nutrients available



## Working Prototype
Find a working prototype with Node at http://not-just-luck.herokuapp.com/ .
Find a working prototype with React front end at https://marjona6.github.io/not-just-luck-thinkful-full-stack-capstone-react/build .

## Functionality
* When they first set up their account, users are

## Technical

<h3>Front End</h3>
<ul>
<li>HTML5</li>
<li>CSS3</li>
<li>JavaScript</li>
<li>jQuery</li>
<li>React</li>
</ul>
<h3>Back End</h3>
<ul>
<li>Node.js</li>
<li>Express.js</li>
<li>MongoDB</li>
<li>Mongoose</li>
<li>mLab database</li>
<li><a href="https://mochajs.org/">Mocha</a> and <a href="http://chaijs.com/">Chai</a> for testing</li>
</ul>
<h3>Responsive</h3>
<ul>
<li>The app is responsive and optimized for both desktop and mobile viewing and use.</li>
</ul>
<h3>Security</h3>
<ul>
<li>User passwords are encrypted using <a href="https://github.com/dcodeIO/bcrypt.js">bcrypt.js</a>.</li>
</ul>

## API Documentation
API endpoints for the back end include:
* POST to '/users/create' for creating a new user
* POST to '/signin' to sign in an existing user
* POST to '/new/create' to add an achievement to a user's list of accomplishments
* PUT to '/achievement/:id' to update an existing achievement
* GET to '/ingredient/:name' to search external api for user search term
* GET to '/nix/:number' when a user selects a food item to add, this makes a external api call to get specifics on the food item
* DELETE to '/achievement/:id' to delete a single achievement by ID

## Development Roadmap
Planned additional features and improvements will allow users to:

* Change password
* Update email address
