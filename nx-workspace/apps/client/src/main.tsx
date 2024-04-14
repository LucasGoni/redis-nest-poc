import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app/app';
import NewsSearch from './components/news-search';
import ArticleDetail from './components/article-detail';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsSearch />} />
        <Route path="/article-detail" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
