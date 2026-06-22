const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const taskValidation = [
  body('title').trim().notEmpty().withMessage('სათაური სავალდებულოა'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('status უნდა იყოს: pending, in-progress ან completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('priority უნდა იყოს: low, medium ან high'),
];

router.use(protect);

router.get('/stats', getTaskStats);

router.route('/').get(getTasks).post(taskValidation, createTask);

router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;