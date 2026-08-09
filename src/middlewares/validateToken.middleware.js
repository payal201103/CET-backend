import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import AuthService from '../services/auth.service.js';

const authService = new AuthService();

const validateToken = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1] || req.query.token;

	try {
		if (!token) return res.handler.unauthorized({}, 'Token is required');

		const payload = jwt.verify(token, config.jwt.secret);

		if (!payload) return res.handler.unauthorized({}, 'Invalid token');

		const userId = payload.userId;

		const result = await authService.checkUserSession(userId, token);

		if (!result || !result.token) return res.handler.unauthorized({}, 'Session expired');

		req.user = {
			userName: result.userName,
			userId: result.userId,
			roleName: result.roleName,
			Firstname: result.Firstname,
			Lastname: result.Lastname,
			token,
		};

		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError)
			return res.handler.unauthorized({}, 'Token expired');

		return res.handler.unauthorized({}, 'Invalid token');
	}
};

export default validateToken;
