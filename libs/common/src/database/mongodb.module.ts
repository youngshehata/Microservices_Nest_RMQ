import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from '@app/common';

//? MongoDBModule is responsible for connecting to the MongoDB database
//? It uses MongooseModule to establish the connection using the URI from environment variables
//? Used to avoid boilerplate code in each module that requires MongoDB connection

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configSerivce: ConfigService) => {
        if (!configSerivce.get<string>(MONGODB_URI)) {
          throw new Error(
            'MONGODB_URI is not defined in the environment variables',
          );
        }
        return {
          uri: configSerivce.get<string>(MONGODB_URI),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoDBModule {}
