module.exports = function validateUser(user) {
  let validated = {
    user: {},
    password: false,
    errors: []
  }

  let validatedUser = true;

  if (!user.username || typeof user.username != 'string') {
    validated.errors.push({ code: 1, message: 'Поле username обязательно для заполнения', user });
    validatedUser = false;
  }

  if (!user.password || typeof user.password != 'string' || user.password.length < 6) {
    validated.errors.push({ code: 1, message: 'Поле password обязательно для заполнения, минимум 6 символов', user });
    validatedUser = false;
  }

  if (!user.firstName || typeof user.firstName != 'string') {
    validated.errors.push({ code: 1, message: 'Поле firstName обязательно для заполнения', user });
    validatedUser = false;
  }

  if (!user.lastName || typeof user.lastName != 'string') {
    validated.errors.push({ code: 1, message: 'Поле lastName обязательно для заполнения', user });
    validatedUser = false;
  }

  if (validatedUser) {
    validated.user.username = user.username;
    validated.password = user.password;
    validated.user.firstName = user.firstName;
    validated.user.lastName = user.lastName;
    validated.user.isAdmin = false;
  }

  return validated;
}