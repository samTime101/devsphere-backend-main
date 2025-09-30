import prisma from "@/db/prisma";
import { prismaSafe } from "@/lib/prismaSafe";


class AuditService {
  async getAllAudits() {
    try {
      const [error, audits] = await prismaSafe(
        prisma.auditLogs.findMany({
          take: 10
        })
      )
      if (error) return { success: false, error }
      if (!audits) return { success: false, error: "No audits found" }
      return { success: true, data: audits }
    } catch (error: any) {
      console.log("Error while fetching auditLogs: ", error)
      return { success: false, error: "Internal Server Error" }
    }
  }
}

const auditService = new AuditService();
export default auditService;
