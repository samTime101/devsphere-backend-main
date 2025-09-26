import type { ActionType, Models } from "@prisma/client";
import type { PrismaClient } from "@prisma/client/extension";
import { requestContext } from "@/context/request.context";

type AuditOperation = "create" | "update" | "delete";

type QueryContext = {
    model: string; 
    operation: string; 
    args: any;
    query: (args: any) => Promise<any>;
};

// List of operations
const actionsToAudit: AuditOperation[] = ["create", "update", "delete"];

// Map model names to their values
const modelToEnumMap: Record<string, Models> = {
    User: "USER",
    user: "USER",
    member: "MEMBER",
    Member: "MEMBER",
    Events: "EVENT",
    events: "EVENT",
    EventSchedule: "EVENTSCHEDULE",
    eventSchedule: "EVENTSCHEDULE",
    Project: "PROJECT",
    project: "PROJECT",
    ProjectContributors: "PROJECTCONTRIBUTORS",
    projectContributors: "PROJECTCONTRIBUTORS",
    Contributor: "CONTRIBUTOR",
    contributor: "CONTRIBUTOR",
    Tag: "TAG",
    tag: "TAG",
};

const resolveDelegate = (client: PrismaClient, model: string) => {
    // Checking if the provided model exist on the prisma client
    const exact = (client as any)[model];
    if (exact) {
        // if the model exist, then return it 
        return exact;
    }
    // if the model name doesn't exit, try using the camelCase version.
    const camel = model.charAt(0).toLowerCase() + model.slice(1);
    return (client as any)[camel];
};

// finds the enum value for the given model name by capitalizing the first letter of the model name
// or converting the entire model name to upper case
const resolveEntity = (model: string): Models | undefined => {
    return modelToEnumMap[model] ?? modelToEnumMap[model.charAt(0).toUpperCase() + model.slice(1)] ?? (model.toUpperCase() as Models);
};


const shouldDebug = () => process.env.AUDIT_DEBUG === "true" || process.env.NODE_ENV === "development";

// Middleware to handle auditing
export const auditMiddleware = (prisma: PrismaClient) => {
    return prisma.$extends({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }: QueryContext) {
                    const op = operation as AuditOperation;

                    // Skip if db transaction is about AuditLogs or models which doesnt need to be audited
                    if (model === "AuditLogs" || !actionsToAudit.includes(op)) {
                        return query(args);
                    }

                    const debug = shouldDebug();
                    if (debug) {
                        console.debug(`[AUDIT] ${model}.${operation} intercepted`);
                    }

                    let before: Record<string, unknown> | null = null;
                    const delegate = resolveDelegate(prisma, model);

                    // Fetch the current state of the entity which will be needed when returing before and after
                    if ((op === "update" || op === "delete") && delegate && args?.where) {
                        try {
                            before = await delegate.findUnique({ where: args.where });
                            if (debug) {
                                console.debug(`[AUDIT] Loaded before state for ${model}.${operation}`);
                            }
                        } catch (error) {
                            if (debug) {
                                console.debug(`[AUDIT] Failed to load before state for ${model}.${operation}`, error);
                            }
                        }
                    }

                    const userId = requestContext.getStore()?.userId ?? "UNKNOWN";

                    let result: any;
                    try {
                        // Executing the original query
                        result = await query(args);
                        if (debug) {
                            console.debug(`[AUDIT] ${model}.${operation} executed successfully (id: ${result?.id ?? "n/a"})`);
                        }
                    } catch (error) {
                        if (debug) {
                            console.error(`[AUDIT] ${model}.${operation} failed`, error);
                        }
                        throw error;
                    }

                    // On update operaiton, tracking changes of which field changed and what changed.
                    const changes: Record<string, { before: unknown; after: unknown }> = {};
                    if (op === "update" && before && args?.data) {
                        for (const key of Object.keys(args.data)) {
                            const beforeValue = (before as any)[key];
                            const afterValue = result?.[key];
                            if (!Object.is(beforeValue, afterValue)) {
                                changes[key] = {
                                    before: beforeValue,
                                    after: afterValue,
                                };
                            }
                        }
                        if (debug) {
                            console.debug(`[AUDIT] Change set for ${model}.${operation}:`, changes);
                        }
                    }

                    
                    const entity = resolveEntity(model);

                    if (!entity) {
                        if (debug) {
                            console.debug(`[AUDIT] Skipping audit log for model ${model}; no enum mapping found.`);
                        }
                        return result;
                    }

                    // Create an audit log 
                    await prisma.auditLogs.create({
                        data: {
                            action: op.toUpperCase() as ActionType,
                            userId,
                            entity,
                            entityId: result?.id ?? args?.where?.id ?? "UNKNOWN",
                            changes: Object.keys(changes).length ? changes : null,
                        },
                    });

                    if (debug) {
                        console.debug(`[AUDIT] Audit log written for ${model}.${operation}`);
                    }

                    return result;
                },
            },
        },
    });
};