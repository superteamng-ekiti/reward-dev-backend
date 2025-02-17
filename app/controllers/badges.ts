import { Request, response, Response } from "express";
import { createNewBadge } from "../core/badges";

export const createNewBadgeController = async (req: Request, res: Response) => {
  try {
    const { ipfs_uri, name, multiplier, points, is_claimable, back_story } =
      req.body;

    if (!ipfs_uri || !name || !multiplier || !back_story) {
      return res.status(409).json({
        message: "missing criteria, please confirm",
        response:
          "missing criteria, please ensure ipfs_uri, name, multiplier, points, is_claimable, back_story are included in body"
      });
    }

    const response = await createNewBadge({
      ipfs_uri,
      name,
      multiplier,
      points,
      is_claimable,
      back_story
    });

    return res.status(200).json({
      message: "created badge successfully",
      response
    });
  } catch (error: any) {
    return res.status(409).json({
      message: "something went wrong",
      response: error.toString()
    });
  }
};
