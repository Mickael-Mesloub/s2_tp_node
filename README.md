# S2_NODE_TP

## About the project

This project is a basic exercise to practice Node, Express and MongoDB/Mongoose with authentication using JWT and express-session.

### Usage scenario

1. You will find at the root route (**/**) a register form to create a new account, with input validation and error handling.
2. Once your account is successfully created, you are redirected to the login page (**/login**) route, from where you can login and access your dashboard.
3. Once you successfully logged in, you are redirected to your dashboard (**/dashboard**). On this page, you will only see a welcome message and a logout button.
4. When you press the logout button, your session is destroy and you are logged out and redirected to the root route (**/**). You cannot access your dashboard anymore while you are not logged in again.

5) Also, your JWT has an expiration time (set to 5' in **.env** file). Once your token has expired, you cannot access your dashboard anymore. You have to login again.

## Setup and configuration

The `.env` file is already included, with all the environment variables you will need to make this project work.

You can still modify variables at your ease, especially the JWT_EXPIRATION (set to 5 minutes) to test the 'token expired' case.

The simply have to install the dependences by running

`npm i`

or

`npm install`

## Run the project

Once the dependencies are installed, you can **run** the project. To run this project in development mode, and benefit from **nodemon** 'auto restart on save' feature, you can run

`npm run dev`

otherwise, you can run to simply run the project without **nodemon** with

`npm start`

**Happy coding!**
