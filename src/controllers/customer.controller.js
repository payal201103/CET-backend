import CustomerService from '../services/customer.service.js';
import logger from '../utils/logger.js';

const customerService = new CustomerService();

class CustomerController {
	async getAllCustomers(req, res) {
		try {
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';
			const customers = await customerService.getAllCustomers(userId, userRole);
			return res.handler.success(customers, 'Customers fetched successfully');
		} catch (error) {
			logger.error('Error in getAllCustomers controller', { error });
			return res.handler.serverError({}, error.message || 'Error fetching customers');
		}
	}

	async createCustomer(req, res) {
		try {
			const { customerName, mobileNumber, emailId, gstNumber } = req.body;
			const createdBy = req.user?.userId;

			const customerData = {
				customerName,
				mobileNumber,
				emailId,
				gstNumber,
				createdBy,
			};

			const newCustomer = await customerService.createCustomer(customerData);
			return res.handler.success(newCustomer, 'Customer created successfully');
		} catch (error) {
			logger.error('Error in createCustomer controller', { error });
			return res.handler.serverError({}, error.message || 'Error creating customer');
		}
	}

	async deleteCustomer(req, res) {
		try {
			const { id } = req.params;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Customer ID is required');
			}

			await customerService.deleteCustomer(id, userId, userRole);
			return res.handler.success({}, 'Customer deleted successfully');
		} catch (error) {
			logger.error('Error in deleteCustomer controller', { error });
			return res.handler.serverError({}, error.message || 'Error deleting customer');
		}
	}

	async updateCustomer(req, res) {
		try {
			const { id } = req.params;
			const { customerName, mobileNumber, emailId, gstNumber } = req.body;
			const userId = req.user?.userId;
			const userRole = req.user?.roleName || '';

			if (!id) {
				return res.handler.badRequest({}, 'Customer ID is required');
			}

			const customerData = {
				customerName,
				mobileNumber,
				emailId,
				gstNumber,
			};

			const updatedCustomer = await customerService.updateCustomer(
				id,
				customerData,
				userId,
				userRole
			);
			return res.handler.success(updatedCustomer, 'Customer updated successfully');
		} catch (error) {
			logger.error('Error in updateCustomer controller', { error });
			return res.handler.serverError({}, error.message || 'Error updating customer');
		}
	}
}

export default CustomerController;
