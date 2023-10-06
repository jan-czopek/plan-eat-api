const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const user = await User.findAll();

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(id);
    const user = await User.findOne({ where: { id: id } });

    if (!user) return res.status(404).json({ message: 'User does not exist' });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  const {
    userName,
    password,
    roles
  } = req.body;

  if (!userName || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      userName,
      password: hashedPwd,
      roles
    });
    res.json(newUser);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      id,
      userName,
      password,
      roles,
      active
    } = req.body;

    // Confirm data 
    if (!id || !userName || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
      return res.status(400).json({ message: 'All fields except password are required' })
    }

    const user = await User.findByPk(parseInt(id));
    if (userName) user.userName = userName;
    if (password) {
      const hashedPwd = await bcrypt.hash(password, 10);
      user.password = hashedPwd;
    }
    if (Array.isArray(roles) && roles.length) user.roles = roles;
    if (typeof active !== 'boolean') user.active = active;

    await user.save();

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await User.destroy({
      where: {
        id,
      },
    });
    res.send(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const {
    userName,
    password
  } = req.body;
  const user = await User.findOne({ where: { userName: userName } });
  if (!user) {
    res.send(401);
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const accesToken = jwt.sign(
        { "userName": user.userName },
        process.env.ACCES_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      const refreshToken = jwt.sign(
        { "userName": user.userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      user.refreshToken = refreshToken;
      await user.save();
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000 //1 day
      });
      res.json({ accesToken });
    } else {
      res.send(401);
    }
  }
}

exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.send(401);
  }
  else {
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ where: { refreshToken: refreshToken } });

    if (!user) {
      res.send(403);
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || user.userName !== decoded.userName) {
            res.send(403);
          } else {
            const accesToken = jwt.sign(
              { "userName": decoded.userName },
              process.env.ACCES_TOKEN_SECRET,
              { expiresIn: '30s' }
            );
            res.json({ accesToken });
          }
        }
      );
    }
  }
}

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.send(204);
  } else {
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ where: { refreshToken: refreshToken } });

    if (!user) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      });
      res.send(204);
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err || user.userName !== decoded.userName) {
            res.send(403);
          } else {
            user.refreshToken = '';
            await user.save();
            res.clearCookie('jwt', {
              httpOnly: true,
              sameSite: 'None',
              secure: true
            });
            res.send(204);
          }
        }
      )

    }
  }
}