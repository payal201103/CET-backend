import CustomerModel from '../models/customer.model.js';

const customerModel = new CustomerModel();

class CustomerService {
	async getAllCustomers(userId, userRole) {
		return await customerModel.getAllCustomers(userId, userRole);
	}

	async createCustomer(customerData) {
		const result = await customerModel.createCustomer(customerData);
		return {
			id: result.id,
			name: customerData.customerName,
			mobile: customerData.mobileNumber,
			email: customerData.emailId,
			gstNumber: customerData.gstNumber,
			createdBy: customerData.createdBy,
		};
	}

	async deleteCustomer(id, userId, userRole) {
		return await customerModel.deleteCustomer(id, userId, userRole);
	}

	async updateCustomer(id, customerData, userId, userRole) {
		await customerModel.updateCustomer(id, customerData, userId, userRole);
		return {
			id,
			name: customerData.customerName,
			mobile: customerData.mobileNumber,
			email: customerData.emailId,
			gstNumber: customerData.gstNumber,
		};
	}
}

export default CustomerService;
