import { IArticle } from './article.interface';

export interface IEndpointResponse {
  source: string;
  responseTime: string;
  data: {
    status: string;
    totalResults: number;
    articles: IArticle[];
  };
}