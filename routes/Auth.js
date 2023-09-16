const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Auth = require('../middleware/Auth');
const jwt = require('jsonwebtoken');
require("dotenv").config
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const jwtsecret = process.env.jwtSecret

// @route    GET api/auth
// @desc     Get logged user
// @access   Private
router.get('/', Auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user); 

	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
}); 


// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public
router.post('/',
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Password is required').exists(),
	async (req, res) => {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	  }
  
	  const { email, password } = req.body;
  
	  try {

		let user = await User.findOne({ email });
		
		if (!user) {
		  return res.status(400).json({ msg: 'Invalid Credentials' });
		}
  
		const isMatch = await bcrypt.compare(password, user.password);
  
		if (!isMatch) {
		  return res.status(400).json({ msg: 'Invalid Credentials' });
		}
  
		const payload = {
		  user: {
			id: user.id
		  }
		};
  
		jwt.sign(
		  payload,
		  jwtsecret,
		  {
			expiresIn: 36000
		  },
		  (err, token) => {
			if (err) throw err;
			res.json({ token });
		  }
		);
	  } catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	  }
	}   
);
module.exports = router;