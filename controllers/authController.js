import validator from 'validator';
import User from '../Models/User.js';
import { capitalize, trimData } from '../utils/utils.js';
import { validationMessages } from '../validation/validationMessages.js';

const { isEmpty, isEmail } = validator;

export const register = async (req, res) => {
  try {
    const {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
      confirmPassword,
    } = trimData(req.body);

    // ==========
    // INPUT SECURIZATION AND VALIDATION
    // ==========

    let errors = [];
    if (!firstNameInput || isEmpty(firstNameInput)) {
      errors.push(validationMessages.required('Prénom'));
    }
    if (!lastNameInput || isEmpty(lastNameInput)) {
      errors.push(validationMessages.required('Nom de famille'));
    }

    if (!emailInput || isEmpty(emailInput)) {
      errors.push(validationMessages.required('Email'));
    }

    if (!isEmail(emailInput)) {
      errors.push(validationMessages.invalidEmail);
    }

    if (!passwordInput || isEmpty(passwordInput)) {
      errors.push(validationMessages.required('Mot de passe'));
    }

    if (!confirmPassword || isEmpty(confirmPassword)) {
      errors.push(validationMessages.required('Confirmer le mot de passe'));
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(', '),
      });
    }

    const isUserExists = await User.findOne(
      { email: emailInput.toLowerCase() },
      { _id: 0, email: 1 }
    );

    // check if user already exists in db and if so, return error
    if (isUserExists) {
      return res.status(400).json({ message: validationMessages.userExists });
    }

    // check if password and confirmPassword are the same and if not, return error
    if (passwordInput !== confirmPassword) {
      return res
        .status(400)
        .json({ message: validationMessages.confirmPasswordWrong });
    }

    // ==========
    // SAVE DATA
    // ==========

    const newUser = new User({
      firstName: capitalize(firstNameInput),
      lastName: capitalize(lastNameInput),
      email: emailInput.toLowerCase(),
      password: passwordInput,
    });

    await newUser.save();

    res.status(201).json({
      message: `Inscription réussie ! Bienvenue sur l'application ${capitalize(
        firstNameInput
      )} ${capitalize(lastNameInput)}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email: emailInput, password: passwordInput } = trimData(req.body);

    // ==========
    // INPUT SECURIZATION AND VALIDATION
    // ==========

    let errors = [];

    if (!emailInput || isEmpty(emailInput)) {
      errors.push(validationMessages.required('Email'));
    }

    if (!isEmail(emailInput)) {
      errors.push(validationMessages.invalidEmail);
    }

    if (!passwordInput || isEmpty(passwordInput)) {
      errors.push(validationMessages.required('Mot de passe'));
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(', '),
      });
    }

    // retrieve the user in DB, filtering by email
    const user = await User.findOne({
      email: emailInput.toLowerCase(),
    });

    // if credentials are incorrect, return error
    if (!user) {
      return res
        .status(401)
        .json({ message: validationMessages.incorrectCredentials });
    }

    // compare the password sent by client and the password stored in DB
    const isPasswordMatch = await user.comparePassword(
      passwordInput,
      user.password
    );

    // check if the password sent by client matches the password stored in DB and return an error if not
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: validationMessages.incorrectCredentials });
    }

    // ==========
    // IF EVERYTHING IS OK, CREATE JWT, STORE IT IN SESSION AND SET ISLOOGED = TRUE IN SESSION.AUTH
    // ==========

    const token = await user.createJWT();
    req.session.token = token;
    req.session.auth = {
      isLogged: true,
    };

    // user is redirected to his dashboard once he's logged in
    res.status(301).redirect('/dashboard');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const session = req.session;

    // if there is a session, destroys it, and doing so, removes jwt and isLogged variable stored in session
    if (session) {
      await session.destroy((error) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        // once the session is destroyed, redirects user to main page
        return res.status(301).redirect('/');
      });
    } else {
      // if no session is found, redirects user to main page
      res.status(301).redirect('/');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
