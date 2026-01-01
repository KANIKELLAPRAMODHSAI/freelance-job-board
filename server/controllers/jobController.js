const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        postedBy: {
          select: { name: true, email: true }
        },
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        postedBy: {
          select: { name: true, email: true }
        },
        applications: {
          include: {
            applicant: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, description, budget, location } = req.body;
    
    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        location,
        postedById: req.userId
      }
    });
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
};

module.exports = { getAllJobs, getJobById, createJob };