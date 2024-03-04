import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from "kafkajs";
import { ContextStorage, TraceContext } from "../util/ContextStorage";
import * as uuid from "uuid";
import { AppService } from "../app.service";

@Injectable()
export class ConsumerService implements OnModuleInit, OnApplicationShutdown {

  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {
  }

  async onModuleInit() {

    // Consume Data with Spcific topic
    this.logger.log("monModuleInit");
    await this.consume(
      { topics: ["test"] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const requestId: string = String(message.headers["x-request-id"]) || uuid.v4();
          const userAgent: string = String(message.headers['x-test']) || '';
          const traceContext: TraceContext = {
            requestId,
            userAgent
          };
          ContextStorage.set(traceContext);
          this.logger.log({
            value: message.value.toString(),
            topic: topic.toString(),
            partition: partition.toString()
          });
          this.appService.getHello(message.value.toString());
        }

      }
    );
  }

  private readonly kafka = new Kafka({
    brokers: ["localhost:29092"]
  });

  private consumer: Consumer;

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {

    // We need to spcifiy the groupID while initializing the Kafka Consumer
    this.consumer = this.kafka.consumer({ groupId: "nestjs-kafka" });

    // Connecting Consumer
    await this.consumer.connect();

    //Passing Topics to consumer
    await this.consumer.subscribe(topics);

    //Setting  the Consumer Config
    await this.consumer.run(config);
  }

  async onApplicationShutdown() {
    // Disconnect the consumer on Apllication shutdown
    await this.consumer.disconnect();
  }
}
