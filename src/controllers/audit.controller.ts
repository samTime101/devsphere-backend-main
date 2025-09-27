import { ErrorResponse, SuccessResponse } from "@/dtos";
import auditService from "@/services/audit.service"
import { HTTP } from "@/utils/constants";
import type { Request, Response } from "express";

class AuditController {
  async getAudits(_: Request, res: Response) {
    try {
      const result = await auditService.getAllAudits();
      if (!result.success) return res.status(HTTP.BAD_REQUEST).json(ErrorResponse(HTTP.BAD_REQUEST, result.error))
      return res.status(HTTP.OK).json(SuccessResponse(HTTP.OK, "Successfully fetched.", result.data))
    } catch (error) {
      console.log("Error while fetching auditsLogs: ", error)
      return res.status(HTTP.INTERNAL).json(ErrorResponse(HTTP.INTERNAL, "Internal Server Error"))

    }
  }
};

const auditController = new AuditController();
export default auditController;
