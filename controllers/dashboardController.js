import User from '../Models/User.js';

export const renderDashboard = async (req, res) => {
  const userId = req.userId;

  console.log(userId);

  const user = await User.find({ _id: userId });

  if (!user) {
    console.log('NO USER');
  }

  console.log('user found !', user);

  res.status(200).json({ message: 'Bienvenue sur votre Dashboard' });
};
