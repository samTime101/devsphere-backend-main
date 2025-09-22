import { ErrorResponse, SuccessResponse } from "@/dtos";
import { contributorServices } from "@/services/contributor.service";
import { HTTP } from "@/utils/constants";
import type { Request, Response } from "express";

class ContributorController {
  async getContributors(req: Request, res: Response) {
    try {
      const contributors = await contributorServices.getAllContributors();

      if (!contributors.success || !contributors.data) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json(ErrorResponse(HTTP.BAD_REQUEST, contributors.error));
      }
      return res
        .status(HTTP.OK)
        .json(SuccessResponse(HTTP.OK, "Contributors fetched successfully", contributors.data));
    } catch (error) {}
  }
}

export const contributorController = new ContributorController();
