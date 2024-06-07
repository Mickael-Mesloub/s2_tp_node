import mongoose from 'mongoose';
import { validationMessages } from '../validation/validationMessages.js';
import validator from 'validator';
import { validationRules } from '../validation/validationRules.js';
import { hashPassword } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, validationMessages.required('Prénom')],
      trim: true,
      minlength: [2, validationMessages.minLength('Le prénom', 2)],
      maxlength: [255, validationMessages.maxLength('Le prénom', 255)],
      validate: {
        validator: (v) => validationRules.nameFields.test(v),
        message: validationMessages.nameFields('Le prénom'),
      },
    },
    lastName: {
      type: String,
      required: [true, validationMessages.required('Nom de famille')],
      trim: true,
      minlength: [2, validationMessages.minLength('Le nom de famille', 2)],
      maxlength: [255, validationMessages.maxLength('Le nom de famille', 255)],
      validate: {
        validator: (v) => validationRules.nameFields.test(v),
        message: validationMessages.nameFields('Le nom de famille'),
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, validationMessages.required("L'email")],
      trim: true,
      lowerCase: true,
      maxlength: [255, validationMessages.maxLength("L'email", 255)],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: validationMessages.invalidEmail,
      },
    },
    password: {
      type: String,
      required: [true, validationMessages.required('Mot de passe')],
      minlength: [6, validationMessages.minLength('Le mot de passe', 6)],
      maxlength: [255, validationMessages.maxLength('Le mot de passe', 255)],
      validate: {
        validator: (v) =>
          validator.isStrongPassword(v, {
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minLength: 6,
            returnScore: true,
          }),
        message: validationMessages.weakPassword,
      },
    },
  },
  { timestamps: true }
);

// middleware to hash password before saving it in database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// compare password sent by client with password stored in db
userSchema.methods.comparePassword = async function (passwordInput) {
  const hashedPasswordInput = await hashPassword(passwordInput);
  return hashedPasswordInput === this.password;
};

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

const User = model('User', userSchema);

export default User;
