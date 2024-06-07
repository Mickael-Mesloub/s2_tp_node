import User from '../Models/User.js';

export const renderDashboard = async (req, res) => {
  const userId = req.userId;

  const user = await User.findOne({ _id: userId });
  console.log(user);

  if (!user) {
    return res.status(301).redirect('/login');
  }

  console.log('user found !', user);

  res.render('dashboard', { user });
};
