import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}
  getOptions(queue: string, noAck: boolean = false): RmqOptions {
    const rmqUrl = this.configService.get<string>('RABBIT_MQ_URI');
    if (!rmqUrl) {
      throw new Error(
        'RABBIT_MQ_URI is not defined in the environment variables',
      );
    }

    return {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: queue,
        noAck: noAck,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
