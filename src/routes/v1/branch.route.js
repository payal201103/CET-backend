import express from 'express';
import validateToken from '../../middlewares/validateToken.middleware.js';
import BranchController from '../../controllers/branch.controller.js';

const router = express.Router();
const branchController = new BranchController();

// Require validation token for all branch routes
router.use(validateToken);

router.get('/', branchController.getAllBranches);
router.post('/', branchController.createBranch);

export default router;
