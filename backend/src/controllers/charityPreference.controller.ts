import { Request, Response, NextFunction } from 'express';
import { charityPreferenceService } from '../services/charityPreference.service.js';
import { updateCharityPreferenceSchema } from '../types/charityPreference.types.js';

export const getCharityPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;

    const preference = await charityPreferenceService.getPreference(userId, jwt);

    res.status(200).json({
      status: 'ok',
      data: {
        preference
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCharityPreference = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;

    const parseResult = updateCharityPreferenceSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: errorMessage
      });
      return;
    }

    const preference = await charityPreferenceService.updatePreference(
      userId,
      jwt,
      parseResult.data
    );

    res.status(200).json({
      status: 'ok',
      message: 'Charity preference updated successfully',
      data: {
        preference
      }
    });
  } catch (error) {
    next(error);
  }
};
