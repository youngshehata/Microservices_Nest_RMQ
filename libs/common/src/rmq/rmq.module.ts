import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RABBIT_MQ_URI } from '@app/common';
import { RmqService } from './rmq.service';

// This module is responsible for setting up RabbitMQ as a microservice transport
// It allows other modules to register RabbitMQ clients with specific service names
// So it would become a provider (can send data to consumers )

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ serviceName }): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: serviceName,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>(RABBIT_MQ_URI)!],
                queue: configService.get<string>(
                  `RABBIT_MQ_${serviceName}_QUEUE`!,
                ),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
