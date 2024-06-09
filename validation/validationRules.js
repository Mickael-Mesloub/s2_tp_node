export const validationRules = {
  nameFields: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ'-]*[a-zA-ZÀ-ÿ]$/, // accepts only letters, hyphen and apostrophe
  password: /^(?!.*[<>{}()\\`]).{6,255}$/, // does not accept the following characters: : <, >, (, ), {, }, \\, et \``
};
