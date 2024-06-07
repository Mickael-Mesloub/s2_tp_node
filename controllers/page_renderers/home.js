export const renderHome = (req, res) => {
  const session = req.session;
  if (session) console.log(session);
  res.render('home');
};
