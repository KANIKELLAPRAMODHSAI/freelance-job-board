const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: parseInt(jobId),
        applicantId: req.userId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const application = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        applicantId: req.userId,
        coverLetter
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply' });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { applicantId: req.userId },
      include: {
        job: {
          include: {
            postedBy: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

module.exports = { applyToJob, getUserApplications };