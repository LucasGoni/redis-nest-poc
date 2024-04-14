import { IArticle } from './article.interface'

export interface INewsApiResponse {
  status: string;
  totalResults: number;
  articles: IArticle[];
}