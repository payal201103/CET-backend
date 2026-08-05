import sql from 'mssql';
import { executeQuery, executeStoredProcedure } from '../database/index.js';
import logger from '../utils/logger.js';

class UserModel {
	async getAllUsers(userRole, userId) {
		try {
			const params = [
				{ name: 'UserRole', type: sql.VarChar(50), value: userRole },
				{ name: 'CurrentUserId', type: sql.Int, value: userId },
			];
			return await executeStoredProcedure('sp_GetUsersByRole', params);
		} catch (error) {
			logger.error('Error in getAllUsers model', { error });
			throw error;
		}
	}

	async getUserByUsername(username) {
		try {
			const query = 'SELECT userID as id, username FROM users WHERE username = @username';
			const result = await executeQuery(query, [
				{ name: 'username', type: sql.VarChar(100), value: username },
			]);
			return result[0];
		} catch (error) {
			logger.error('Error in getUserByUsername model', { error });
			throw error;
		}
	}

	async createUser(userData) {
		try {
			const query = `
                INSERT INTO users (username, password, role, Firstname, Lastname, createdBy)
                VALUES (@username, @password, @role, @firstName, @lastName, @createdBy);
                SELECT SCOPE_IDENTITY() as id;
            `;
			const params = [
				{ name: 'username', type: sql.VarChar(100), value: userData.username },
				{ name: 'password', type: sql.VarChar(255), value: userData.password },
				{ name: 'role', type: sql.VarChar(50), value: userData.role },
				{ name: 'firstName', type: sql.VarChar(100), value: userData.firstName },
				{ name: 'lastName', type: sql.VarChar(100), value: userData.lastName },
				{ name: 'createdBy', type: sql.Int, value: userData.createdBy || null },
			];
			const result = await executeQuery(query, params);
			return result[0];
		} catch (error) {
			logger.error('Error in createUser model', { error });
			throw error;
		}
	}

	async deleteUser(userId) {
		try {
			const query = 'DELETE FROM users WHERE userID = @userId';
			return await executeQuery(query, [{ name: 'userId', type: sql.Int, value: Number(userId) }]);
		} catch (error) {
			logger.error('Error in deleteUser model', { error });
			throw error;
		}
	}
}

export default UserModel;
