import validator from 'validator';
import User from '../Models/User.js';
import { capitalize, trimData } from '../utils/utils.js';
import { validationMessages } from '../validation/validationMessages.js';

const { isEmpty, isEmail, isLength, isStrongPassword } = validator;

export const register = async (req, res) => {
  try {
    const {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
      confirmPassword,
    } = trimData(req.body);

    // ============================== \\
    // SECURITY AND VALIDATION CHECKS \\
    // ============================== \\

    let errors = [];

    // ---------- Firstname validation ----------- \\

    if (!firstNameInput || isEmpty(firstNameInput)) {
      errors.push(validationMessages.required('Prénom'));
    }
    if (!isLength(firstNameInput, { min: 2 })) {
      errors.push(validationMessages.minLength('Le prénom', 2));
    }
    if (!isLength(firstNameInput, { max: 255 })) {
      errors.push(validationMessages.maxLength('Le prénom', 255));
    }

    // ---------- Lastname validation ----------- \\

    if (!lastNameInput || isEmpty(lastNameInput)) {
      errors.push(validationMessages.required('Nom de famille'));
    }
    if (!isLength(lastNameInput, { min: 2 })) {
      errors.push(validationMessages.minLength('Le Nom de famille', 2));
    }
    if (!isLength(lastNameInput, { max: 255 })) {
      errors.push(validationMessages.maxLength('Le Nom de famille', 255));
    }

    // ---------- Email validation ----------- \\

    if (!emailInput || isEmpty(emailInput)) {
      errors.push(validationMessages.required('Email'));
    }

    if (!isLength(emailInput, { max: 255 })) {
      errors.push(validationMessages.maxLength("L'email", 255));
    }

    if (!isEmail(emailInput)) {
      errors.push(validationMessages.invalidEmail);
    }

    // ---------- Password validation ----------- \\

    if (!passwordInput || isEmpty(passwordInput)) {
      errors.push(validationMessages.required('Mot de passe'));
    }
    if (!isLength(passwordInput, { min: 6 })) {
      errors.push(validationMessages.minLength('Le mot de passe', 6));
    }
    if (!isLength(passwordInput, { max: 255 })) {
      errors.push(validationMessages.maxLength('Le mot de passe', 255));
    }
    if (
      !isStrongPassword(passwordInput, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
      })
    ) {
      errors.push(validationMessages.weakPassword);
    }

    // ---------- Confirm password validation ----------- \\

    if (!confirmPassword || isEmpty(confirmPassword)) {
      errors.push(validationMessages.required('Confirmer le mot de passe'));
    }

    // check if password and confirmPassword are the same and if not, push new error
    if (passwordInput !== confirmPassword) {
      errors.push(validationMessages.confirmPasswordWrong);
    }

    // ---------- Check if user already exists ---------- \\

    const isUserExists = await User.findOne(
      { email: emailInput.toLowerCase() },
      { _id: 0, email: 1 }
    );

    // check if user already exists in db and if so, push new error in errors array
    if (isUserExists) {
      errors.push(validationMessages.userExists);
    }

    // ---------- END OF SECURITY AND VALIDATION CHECKS ---------- \\

    // after all these security and validation checks, send errors array in req.flash to display error messages
    if (errors.length > 0) {
      req.flash('errors', errors);
      return res.status(301).redirect('back');
    }

    // =================== \\
    // SAVE NEW USER IN DB \\
    // =====================\\

    const newUser = new User({
      firstName: capitalize(firstNameInput),
      lastName: capitalize(lastNameInput),
      email: emailInput.toLowerCase(),
      password: passwordInput,
    });

    await newUser.save();

    const registerSuccessMsg = `Inscription réussie ! Vous pouvez maintenant vous connecter`;
    req.flash('success', [registerSuccessMsg]);

    res.status(301).redirect('/login');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email: emailInput, password: passwordInput } = trimData(req.body);

    // ============================== \\
    // SECURITY AND VALIDATION CHECKS \\
    // ============================== \\

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

    // retrieve the user in DB, filtering by email
    const user = await User.findOne({
      email: emailInput.toLowerCase(),
    });

    // if credentials are incorrect, add error in errors array and reload page
    if (!user) {
      errors.push(validationMessages.incorrectCredentials);
      req.flash('errors', errors);
      return res.status(301).redirect('back');
    }

    // compare the password sent by client and the password stored in DB
    const isPasswordMatch = await user.comparePassword(passwordInput);

    // check if the password sent by client matches the password stored in DB and add error in errors array if not
    if (!isPasswordMatch) {
      errors.push(validationMessages.incorrectCredentials);
    }

    // ---------- END OF SECURITY AND VALIDATION CHECKS ---------- \\

    // after all these security and validation checks, send errors array in req.flash to display error messages

    if (errors.length > 0) {
      req.flash('errors', errors);
      return res.status(301).redirect('back');
    }

    // ============================================================================================ \\
    // IF EVERYTHING IS OK, CREATE JWT, STORE IT IN SESSION AND SET ISLOOGED = TRUE IN SESSION.AUTH \\
    // ============================================================================================ \\

    const token = await user.createJWT();
    req.session.token = token;
    req.session.auth = {
      isLogged: true,
    };

    const loginSuccessMsg = `Vous êtes connecté !`;
    req.flash('success', [loginSuccessMsg]);

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
