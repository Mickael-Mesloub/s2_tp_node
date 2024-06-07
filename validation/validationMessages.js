export const validationMessages = {
  required: (field) => `Le champ ${field} est requis`,
  minLength: (field, min) =>
    `${field} doit contenir au moins ${min} caractères`,
  maxLength: (field, max) => `${field} ne peut pas dépasser ${max} caractères`,
  invalidEmail: `Veuillez entrer un email valide`,
  nameFields: (field) =>
    `${field} est invalide. Il ne peut contenir que des lettres, un trait d'union, une apostrophe`,
  weakPassword:
    'Le mot de passe doit contenir au moins 1 minuscule, 1 majuscule et 1 chiffre',
  userExists: `Cet utilisateur existe déjà. Veuillez entrer une nouvelle adresse mail`,
  confirmPasswordWrong: `Les 2 mots de passe ne correspondent pas. Veuillez réessayer`,
  incorrectCredentials: `Identifiants incorrects. Veuillez réessayer`,
};
