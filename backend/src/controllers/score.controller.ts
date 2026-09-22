import { Request, Response, NextFunction } from 'express';
import { scoreService } from '../services/score.service.js';
import { createScoreSchema, updateScoreSchema } from '../types/score.types.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getScores = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;

    const scores = await scoreService.getUserScores(userId, jwt);

    res.status(200).json({
      status: 'ok',
      data: {
        scores,
        count: scores.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addScore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;

    const parseResult = createScoreSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: errorMessage
      });
      return;
    }

    const result = await scoreService.addScore(userId, jwt, parseResult.data);

    res.status(201).json({
      status: 'ok',
      message: 'Score added successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateScore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid score ID format. Must be a valid UUID.'
      });
      return;
    }

    const parseResult = updateScoreSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join(', ');
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: errorMessage
      });
      return;
    }

    const result = await scoreService.updateScore(userId, jwt, id, parseResult.data);

    res.status(200).json({
      status: 'ok',
      message: 'Score updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteScore = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const jwt = req.authToken!;
    const { id } = req.params;

    if (!id || !UUID_REGEX.test(id)) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid score ID format. Must be a valid UUID.'
      });
      return;
    }

    await scoreService.deleteScore(userId, jwt, id);

    res.status(200).json({
      status: 'ok',
      message: 'Score deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
