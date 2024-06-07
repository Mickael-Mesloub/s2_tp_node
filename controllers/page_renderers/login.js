export const renderLogin = (req, res) => {
  const { auth } = req.session;

  if (auth && auth.isLogged) {
    return res.status(301).redirect('/dashboard');
  }

  res.render('login');
};
