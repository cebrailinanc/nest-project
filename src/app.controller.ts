import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {
  }

  @Get()
  async getHello(): Promise<string>  {
    this.logger.log("getHello ----1");
    await sleep(10000);
    this.logger.log("getHello ----2");

    return this.appService.getHello("getHello");
  }

  @Get("/call")
  public async call(): Promise<string> {
    this.logger.log("calling ----2");

    await sleep(5000);
    this.logger.log("calling ----2");
    return this.appService.getHello("vsll");
  }

  @Get("/trigger")
  async trigger(): Promise<string>  {
    this.logger.log("trigger ----4");
    await sleep(100);
    this.logger.log("trigger ----45");
    return this.appService.getHello("trigger");
  }
}
