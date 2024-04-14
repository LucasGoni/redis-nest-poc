import { IArticle } from './Article';

export interface IResponseInfo {
  source: string;
  responseTime: string;
  data: {
    status: string;
    totalResults: number;
    articles: IArticle[];
  };
}