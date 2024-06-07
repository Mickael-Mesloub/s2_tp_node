export const renderLogin = (req, res) => {
  const { auth } = req.session;
  const flashSuccess = req.flash('success');
  const flashErrors = req.flash('errors');

  if (auth && auth.isLogged) {
    return res.status(301).redirect('/dashboard');
  }

  res.render('login', { flashSuccess, flashErrors });
};
