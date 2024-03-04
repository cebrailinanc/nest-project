import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import * as console from "console";
import { Request, Response } from "express";
import * as uuid from "uuid";
import { ContextStorage, TraceContext } from "./util/ContextStorage";

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TraceMiddleware.name);

  use(req: Request, res: Response, next: (error?: any) => void): any {
    const requestId: string = req.get('x-request-id') || uuid.v4();
    const userAgent = req.get('x-userAgent') || '';
    const traceContext: TraceContext = {
      requestId,
      userAgent
    };
    ContextStorage.set(traceContext);
    this.logger.log(
      'Middleware is processing before AuthGuard' +
        req.headers['x-request-id'],
    );
    next();
  }
}
