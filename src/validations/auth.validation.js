import Joi from 'joi';

export const login = {
	body: Joi.object()
		.keys({
			userName: Joi.string(),
			username: Joi.string(),
			passWord: Joi.string(),
			password: Joi.string(),
		})
		.or('userName', 'username')
		.or('passWord', 'password'),
};

