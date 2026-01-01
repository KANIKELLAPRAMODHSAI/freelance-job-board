const express = require('express');
const { applyToJob, getUserApplications } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, applyToJob);
router.get('/my-applications', authMiddleware, getUserApplications);

module.exports = router;