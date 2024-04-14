import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { INewsApiResponse } from '../../interface/news-api-response.interface';
import { IQueryParams } from '../../interface/query-params.interface';
import { IEndpointResponse } from '../../interface/enpoint-response.interface';

import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsSearchService {
  constructor (
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
    ) {};

  async getNews(queryParams: IQueryParams): Promise<IEndpointResponse> {
    const cacheKey: string = `news:${JSON.stringify(queryParams)}`;
    let endpointResponse: IEndpointResponse | undefined;
    let cacheResponseTime: string = '';
    let apiResponseTime: string = '';

    try {
      const cacheStartTime: [number, number] = process.hrtime();
      let cachedNews: string | null = null;

      try {
        cachedNews = await this.redisService.get(cacheKey);
      } catch (cacheError) {
        console.error('Error retrieving data from cache:', cacheError);
      }

      const cacheEndTime: [number, number] = process.hrtime();
      const cacheElapsedMilliseconds: number = 
      this.calculateElapsedMilliseconds(cacheStartTime, cacheEndTime);
      cacheResponseTime = `${cacheElapsedMilliseconds} ms`;
        
      if (cachedNews) {
        console.log(`Cache hit for query "${cacheKey}".`);
        const news: INewsApiResponse = JSON.parse(cachedNews);
        endpointResponse = {
          source: this.configService.get<string>('REDIS_SOURCE'),
          data: news,
          responseTime: cacheResponseTime,
        };
      
      } else {
        console.log(`Cache miss for query "${cacheKey}". Fetching from API.`);
        const apiStartTime: [number, number] = process.hrtime();
        let apiResponse: AxiosResponse<INewsApiResponse>;

        try {
          const apiKey = this.configService.get<string>('NEWS_API_KEY');
          apiResponse = await axios.get(this.configService.get<string>('NEWS_API_URL'), { params: { ...queryParams, apiKey } });
        } catch (apiError) {
          console.error('Error fetching data from API:', apiError);
          throw new HttpException('Failed to fetch news from API', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const apiEndTime: [number, number] = process.hrtime();
        const apiElapsedMilliseconds: number = this.calculateElapsedMilliseconds(apiStartTime, apiEndTime);
        apiResponseTime = `${apiElapsedMilliseconds} ms`;

        const news: INewsApiResponse = apiResponse.data;
        console.log(`Saving: "${cacheKey}" for one hour in Redis.`);
        await this.redisService.setEx(cacheKey, 3600, JSON.stringify(news)); // Set cache for 1 hour

        endpointResponse = {
          source: this.configService.get<string>('API_SOURCE'),
          data: news,
          responseTime: apiResponseTime,
        };
      }

      return endpointResponse;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch news', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private calculateElapsedMilliseconds(startTime: [number, number], endTime: [number, number]): number {
    const startMilliseconds = (startTime[0] * 1000) + (startTime[1] / 1000000);
    const endMilliseconds = (endTime[0] * 1000) + (endTime[1] / 1000000);
    return endMilliseconds - startMilliseconds;
  }
}