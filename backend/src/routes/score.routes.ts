import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import {
  getScores,
  addScore,
  updateScore,
  deleteScore
} from '../controllers/score.controller.js';

export const scoreRouter = Router();

// All score routes are strictly authenticated
scoreRouter.use(authenticateUser);

scoreRouter.get('/', getScores);
scoreRouter.post('/', addScore);
scoreRouter.patch('/:id', updateScore);
scoreRouter.delete('/:id', deleteScore);
