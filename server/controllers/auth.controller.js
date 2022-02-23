const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signJWT = (id) => {
  const JWTSecretKey = process.env.JWT_SECRET_KEY;
  const JWTExpiresIn = process.env.JWT_EXPIRES_IN;

  return jwt.sign({ id }, JWTSecretKey, {
    expiresIn: JWTExpiresIn,
  });
};

const sendResWithJWT = (res, statusCode, user) => {
  const token = signJWT(user._id);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
  };

  res.cookie('token', token, cookieOptions).status(statusCode).json({
    status: 'ok',
    token,
    data: {
      user,
    },
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error('email and password is require'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new Error('invalid email or password'));

    if (!(await user.comparePassword(password))) {
      return next(new Error('invalid email or password'));
    }

    user.password = undefined;

    sendResWithJWT(res, 200, user);
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!(email && password)) {
      return next(new Error('email and password is required'));
    }

    const user = await User.findOne({ email });
    if (user) return next(new Error('email already in use, try another email'));

    const newUser = await User.create({ name, email, password });
    newUser.password = undefined;

    sendResWithJWT(res, 200, newUser);
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    let token;
    console.log(req.cookies);
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new Error('please provide token'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) return next(new Error('tidak ada user dengan token tersebut'));

    user.password = undefined;

    res.status(202).json({
      status: 'ok',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.cookie('token', '');
  res.clearCookie('token');
  res.end();
};

module.exports = { login, signup, logout, verify };
