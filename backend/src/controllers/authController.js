const passport = require('passport');

exports.login = passport.authenticate('auth0', {
  scope: 'openid email profile',
});

exports.callback = passport.authenticate('auth0', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/user/profile');
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Logout failed');
    res.redirect('/');
  });
};
