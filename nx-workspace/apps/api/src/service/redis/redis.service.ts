import { createClient, RedisClientType, RedisClientOptions } from 'redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor(private readonly configService: ConfigService) {
    const redisOptions: RedisClientOptions = {
      socket: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
    };
    this.redisClient = createClient(redisOptions);
    this.setupEventHandlers();
    this.connectRedis();
  }

  private async connectRedis() {
    try {
      await this.redisClient.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }

  private setupEventHandlers() {
    this.redisClient.on('error', (err: Error) => {
      console.error('Redis error:', err);
    });
    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
    this.redisClient.on('end', () => {
      console.log('Disconnected from Redis');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.redisClient.disconnect();
      console.log('Redis client disconnected and application exiting');
      process.exit(0);
    });
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    await this.redisClient.setEx(key, seconds, value);
  }

  public getRedisClient(): RedisClientType {
    return this.redisClient;
  }

  public isReady() : boolean {
    return this.redisClient.isReady();
  }
}




// ---------------- LOW LEVEL CLIENT IMPLEMENTATION

// import { createClient, RedisClientType } from 'redis';

// const redisClient: RedisClientType = createClient();

// async function connectRedis() {
//   try {
//     await redisClient.connect();
//   } catch (err) {
//     console.error('Failed to connect to Redis:', err);
//   }
// }

// redisClient.on('error', (err: Error) => {
//   console.error('Redis error:', err);
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redisClient.on('end', () => {
//   console.log('Disconnected from Redis');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await redisClient.disconnect();
//   console.log('Redis client disconnected and application exiting');
//   process.exit(0);
// });

// connectRedis();

// export { redisClient };