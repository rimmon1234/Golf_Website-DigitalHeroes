import { Request, Response, NextFunction } from 'express';
import { charityService } from '../services/charity.service.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getAllCharities = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const charities = await charityService.getActiveCharities();
    res.status(200).json({
      status: 'ok',
      data: {
        charities,
        count: charities.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCharityById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !UUID_REGEX.test(id)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid charity ID format. Must be a valid UUID.'
      });
      return;
    }

    const charity = await charityService.getCharityById(id);

    if (!charity) {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Charity not found or is currently unavailable'
      });
      return;
    }

    res.status(200).json({
      status: 'ok',
      data: {
        charity
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCharityEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !UUID_REGEX.test(id)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid charity ID format. Must be a valid UUID.'
      });
      return;
    }

    const events = await charityService.getCharityEvents(id);

    res.status(200).json({
      status: 'ok',
      data: {
        events,
        count: events.length
      }
    });
  } catch (error) {
    next(error);
  }
};
