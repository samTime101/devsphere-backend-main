import type { ActionType, Models } from "@prisma/client";
import type { PrismaClient } from "@prisma/client/extension";


import type { Prisma } from "@prisma/client";
import { requestContext } from "@/context/request.context";

export const auditMiddleware = (prisma: PrismaClient) => {
    return prisma.$extends({
        model: {
            $allModels: {
                async execute(args: any, next: (args: any) => Promise<any>) {
                    const actionsToAudit = ["create", "update", "delete"];

                    // Only track the defined actions.
                    if (!actionsToAudit.includes(args.action)) return next(args);

                    let before: any = null;

                    if (args.action === "update" || args.action === "delete") {
                        before = await next({ ...args, action: "findUnique" })
                    }

                    let result: any = null;
                    const userId = requestContext.getStore()?.userId ?? "UNKNOWN";

                    try {
                        const result = await next(args)
                    } catch (error: any) {
                        throw new Error("Error while performing database query: ", error)
                    }

                    let changes: Record<string, { before: any, after: any }> = {};
                    if (args.action === "update" && before) {
                        for (const key in args.data) {
                            if (before[key] !== result[key]) {
                                changes[key] = { before: before[key], after: result[key] }
                            }
                        }
                    }


                    await prisma.auditLogs.create({
                        data: {
                            action: args.action.toUpperCase() as ActionType,
                            userId: userId,
                            entity: args.model.toUpperCase() as Models,
                            entitiyId: result.id,
                            changes: Object.keys(changes).length ? changes : null

                        }
                    })

                    return result;

                }
            }
        }
    })
}