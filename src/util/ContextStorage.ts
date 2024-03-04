import { AsyncLocalStorage } from 'async_hooks';

export const ContextStorage = {
  storage: new AsyncLocalStorage<TraceContext>(),
  get() {
    return this.storage.getStore();
  },
  set(context: TraceContext) {
    return this.storage.enterWith(context);
  },
};
export interface TraceContext {
  requestId: string;
  userAgent: string;
}
