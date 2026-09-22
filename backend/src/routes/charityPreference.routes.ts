import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import {
  getCharityPreference,
  updateCharityPreference
} from '../controllers/charityPreference.controller.js';

export const charityPreferenceRouter = Router();

// Strictly authenticated
charityPreferenceRouter.use(authenticateUser);

charityPreferenceRouter.get('/', getCharityPreference);
charityPreferenceRouter.put('/', updateCharityPreference);
