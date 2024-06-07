export const renderHome = (req, res) => {
  res.render('home', { errors: req.flash('errors') });
};
