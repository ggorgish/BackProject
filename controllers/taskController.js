const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Task = require('../models/Task');


const getTasks = asyncHandler(async (req, res) => {
  const query = { user: req.user._id };

  if (req.body.search) {
  }

  if (req.query.status) query.status = req.query.status;
  if (req.query.priority) query.priority = req.query.priority;
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: 'i' };
  }

  const sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt';

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(query).sort(sortBy).skip(skip).limit(limit),
    Task.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: tasks.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('დავალება ვერ მოიძებნა');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('წვდომა აკრძალულია');
  }

  res.json({ success: true, data: task });
});

const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('დავალება ვერ მოიძებნა');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('წვდომა აკრძალულია');
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('დავალება ვერ მოიძებნა');
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('წვდომა აკრძალულია');
  }

  await task.deleteOne();

  res.json({ success: true, data: {} });
});

const getTaskStats = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: stats });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
