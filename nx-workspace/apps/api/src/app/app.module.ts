import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsSearchController } from '../controller/news/news-search.controller';
import { NewsSearchService } from '../service/news/news-search.service';
import { RedisService } from '../service/redis/redis.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController, NewsSearchController],
  providers: [AppService, NewsSearchService, RedisService],
})
export class AppModule {}
