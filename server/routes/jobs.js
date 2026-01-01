const express = require('express');
const { getAllJobs, getJobById, createJob } = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);

module.exports = router;