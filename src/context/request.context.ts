import { AsyncLocalStorage } from "async_hooks";

interface RequestContext {
  userId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();
