import { Controller, Get, Query } from '@nestjs/common';
import { NewsSearchService } from '../../service/news/news-search.service';
import { IQueryParams } from '../../interface/query-params.interface';
import { IEndpointResponse } from '../../interface/enpoint-response.interface';

@Controller('news')
export class NewsSearchController {
  constructor(private readonly newsSearchService: NewsSearchService) {}

  @Get()
  async getNews(@Query() queryParams: IQueryParams): Promise<IEndpointResponse> {
    return this.newsSearchService.getNews(queryParams);
  }
}
