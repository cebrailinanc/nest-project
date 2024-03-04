import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KafkaModule } from "./kafka/kafka.module";
import { ProducerService } from "./producer/producer.service";
import { ConsumerService } from "./consumer/consumer.service";
import { LoggerModule } from "nestjs-pino";
import { ContextStorage } from "./util/ContextStorage";
import { TraceMiddleware } from "./trace-middleware.service";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        messageKey: 'message',
        level: 'trace',
        timestamp: () => `,"time":"${new Date().toISOString()}"`,
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },
        mixin(logger) {
          return {
            appName: 'nest-app',
            requestId: ContextStorage.get()?.requestId
          };
        },

        // serializers: {
        //   req: () => {},
        //   res: () => {}
        // },

        customProps: (req) => {
          return { url: req.url };
        },
      },
    }),
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProducerService, ConsumerService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes('*');
  }
}
