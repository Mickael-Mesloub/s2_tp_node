import validator from 'validator';
import User from '../Models/User.js';
import { capitalize, comparePassword, trimData } from '../utils/utils.js';
import { validationMessages } from '../validation/validationMessages.js';

const { isEmpty } = validator;

export const register = async (req, res) => {
  try {
    const {
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,
      password: passwordInput,
      confirmPassword,
    } = trimData(req.body);

    console.log(
      `- firstName: ${firstNameInput}\n- lastName: ${lastNameInput}\n- email: ${emailInput}\n- password: ${passwordInput}\n- confirmPassword: ${confirmPassword}`
    );

    // ==========
    // INPUT SECURIZATION
    // ==========

    if (!confirmPassword || isEmpty(confirmPassword)) {
      return res.status(400).json({
        message: validationMessages.required('Confirmer le mot de passe'),
      });
    }

    const isUserExists = await User.findOne(
      { email: emailInput },
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

    res.status(200).json({
      message: `Inscription réussie ! Bienvnue sur l'application ${firstNameInput}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email: emailInput, password: passwordInput } = trimData(req.body);
    console.log(`- email: ${emailInput}\n- password: ${passwordInput}`);

    // ==========
    // INPUT SECURIZATION
    // ==========

    let errors = [];

    if (!emailInput || isEmpty(emailInput)) {
      errors.push(validationMessages.required('Email'));
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
    const isPasswordMatch = await comparePassword(passwordInput, user.password);

    // check if the password sent by client matches the password stored in DB and return an error if not
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: validationMessages.incorrectCredentials });
    }

    const token = await user.createJWT();

    res.status(200).json({ message: `Vous êtes bien connecté !`, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
