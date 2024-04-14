import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import axios from 'axios';
import { IArticle } from '../interface/Article';
import { ISearchParams } from '../interface/SearchParams';
import { IResponseInfo } from '../interface/ResponseInfo';
import { validateSearchParams, IValidationResult } from '../util/validate-search-params';
import "../styles/news-search.css";
import logoImage from '../assets/images/clearTechLogo.jpeg';

const NewsSearch: React.FC = () => {
  // const [searchParams, setSearchParams] = useState<ISearchParams>({
  //   q: '',
  //   from: '',
  //   to: '',
  //   sortBy: '',
  // });

  const navigate = useNavigate();

  // Restore searchParams from session storage or initialize to defaults
  const [searchParams, setSearchParams] = useState<ISearchParams>(() => {
    const savedParams = sessionStorage.getItem('searchParams');
    return savedParams ? JSON.parse(savedParams) : { q: '', from: '', to: '', sortBy: '' };
  });

  // Restore articles from session storage or initialize to empty array
  const [articles, setArticles] = useState<IArticle[]>(() => {
    const savedArticles = sessionStorage.getItem('articles');
    return savedArticles ? JSON.parse(savedArticles) : [];
  });

  //const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  //const [responseInfo, setResponseInfo] = useState<IResponseInfo | null>(null);

  const [responseInfo, setResponseInfo] = useState<IResponseInfo | null>(() => {
    const savedResponse = sessionStorage.getItem('responseInfo');
    return savedResponse ? JSON.parse(savedResponse) : null;
  });

  //const navigate = useNavigate();

  
  // Effect to save state to session storage
  useEffect(() => {
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
    sessionStorage.setItem('articles', JSON.stringify(articles));
    if (responseInfo) {
      sessionStorage.setItem('responseInfo', JSON.stringify(responseInfo));
    }
  }, [searchParams, articles, responseInfo]);

  const fetchNews = async (): Promise<void> => {
    setLoading(true);
    setErrors([]);

    const validationResult: IValidationResult | null = validateSearchParams(searchParams);
    if (validationResult && validationResult.errors.length > 0) {
      console.log("Inside validation result");
      setErrors(validationResult.errors);
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${process.env.NX_SERVER_URL}`, {
        params: { ...searchParams },
      }
    );

    console.log(`${process.env.NX_SERVER_URL}`);

      setResponseInfo({
        data: response.data.data,
        source: response.data.source,
        responseTime: response.data.responseTime,
      });

      setArticles(response.data.data.articles || []);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      setErrors(['Failed to fetch news. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  const navigateToArticleDetail = (article: IArticle): void => {
    navigate('/article-detail', { state: { article } });
  };

  const formatMilliseconds = (milliseconds: number): string => {
    const formattedMilliseconds = milliseconds.toFixed(2); 
    return `${formattedMilliseconds} ms`;
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      fetchNews();
    }
  };

//   return (
//     <div className="news-search">
//        <img src={logoImage} alt="Logo" className="logo"/>
//       <div className="search-fields">
//         <label htmlFor="search-keywords">Search by keywords or phrases</label>
//         <input
//           id="search-keywords"
//           className="input-field"
//           value={searchParams.q}
//           onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
//           type="text"
//           placeholder="Search by keywords or phrases"
//           aria-label="Search by keywords or phrases"
//         />

//         <label htmlFor="from-date">From date</label>
//         <input
//           id="from-date"
//           className="input-field"
//           value={searchParams.from}
//           onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
//           type="date"
//           placeholder="From date"
//           aria-label="From date"
//         />

//         <label htmlFor="to-date">To date</label>
//         <input
//           id="to-date"
//           className="input-field"
//           value={searchParams.to}
//           onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
//           type="date"
//           placeholder="To date"
//           aria-label="To date"
//         />

//         <label htmlFor="sort-by">Sort by</label>
//         <select
//           value={searchParams.sortBy}
//           onChange={(e) => setSearchParams({ ...searchParams, sortBy: e.target.value })}
//           aria-label="Sort by"
//         >
//           <option value=""></option>
//           <option value="relevancy">Relevancy</option>
//           <option value="popularity">Popularity</option>
//           <option value="publishedAt">Published At</option>
//         </select>
//       </div>
//       {/* <button className="button-search" onClick={fetchNews}>Search</button> */}
//       <Button variant="contained" onClick={fetchNews}>Search</Button>

//       {loading && <div>Loading...</div>}
//       {errors.length > 0 && (
//         <div>
//           <ul>
//             {errors.map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {responseInfo && (
//         <div className="performance-metrics">
//           <p>Data Source: {responseInfo.source}</p>
//           <p>Response Time: {formatMilliseconds(parseInt(responseInfo.responseTime))}</p>
//         </div>
//       )}

//       {articles.map((article, index) => (
//         <div key={`${article.url}-${index}`} className="news-article">
//           <h2 onClick={() => navigateToArticleDetail(article)}>{article.title}</h2>
//           <p>{article.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

return (
  <div className="news-search">
    {/* <img src={logoImage} alt="Logo" className="logo"/> */}
    <Typography variant="h1" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: '500' }}>Redis Workshop</Typography>
    <div className="search-fields">
      <label htmlFor="search-keywords">Search by keywords or phrases</label>
      <input
        id="search-keywords"
        className="input-field"
        value={searchParams.q}
        onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
        type="text"
        placeholder="Search by keywords or phrases"
        aria-label="Search by keywords or phrases"
      />

      <label htmlFor="from-date">From date</label>
      <input
        id="from-date"
        className="input-field"
        value={searchParams.from}
        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
        type="date"
        placeholder="From date"
        aria-label="From date"
      />

      <label htmlFor="to-date">To date</label>
      <input
        id="to-date"
        className="input-field"
        value={searchParams.to}
        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
        type="date"
        placeholder="To date"
        aria-label="To date"
      />

      <label htmlFor="sort-by">Sort by</label>
      <select
        id="sort-by"
        className="input-field"
        value={searchParams.sortBy}
        onChange={(e) => setSearchParams({ ...searchParams, sortBy: e.target.value })}
        aria-label="Sort by"
      >
        <option value=""></option>
        <option value="relevancy">Relevancy</option>
        <option value="popularity">Popularity</option>
        <option value="publishedAt">Published At</option>
      </select>
    </div>
    <Button variant="contained" sx={{ }} onClick={fetchNews} >Search</Button>

    {loading && <div>Loading...</div>}
    {errors.length > 0 && (
      <ul>
        {errors.map((error, index) => (
            <li key={index}>{error}</li>
        ))}
      </ul>
    )}

    {responseInfo && (
      <div className="performance-metrics">
        <p>Data Source: {responseInfo.source}</p>
        <p>Response Time: {formatMilliseconds(parseInt(responseInfo.responseTime))}</p>
      </div>
    )}

    <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto' }}>
      <Table sx={{ minWidth: '520px' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Published At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow
              key={article.url}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              onClick={() => navigateToArticleDetail(article)}
              hover
              style={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row" align="center">
                {article.title}
              </TableCell>
              <TableCell align="center">{article.description}</TableCell>
              <TableCell align="center">{article.publishedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
};

export default NewsSearch;