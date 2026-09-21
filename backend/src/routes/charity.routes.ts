import { Router } from 'express';
import {
  getAllCharities,
  getCharityById,
  getCharityEvents
} from '../controllers/charity.controller.js';

export const charityRouter = Router();

// Public routes for charity discovery
charityRouter.get('/', getAllCharities);
charityRouter.get('/:id', getCharityById);
charityRouter.get('/:id/events', getCharityEvents);
