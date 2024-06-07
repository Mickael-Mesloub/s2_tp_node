export const renderHome = (req, res) => {
  const flashErrors = req.flash('errors');

  res.render('home', { flashErrors });
};
