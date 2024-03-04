import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {}

  getHello(param: string): string {
    this.logger.log('appservice ' + param);
    return 'Hello World!';
  }
}
