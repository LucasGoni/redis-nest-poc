import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IArticle } from '../interface/Article';
import '../styles/article-detail.css'; 

const ArticleDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { article } = location.state as { article: IArticle };

  // Function to go back to the previous page
  const goBack = (): void => {
    navigate(-1); // Go back to the previous page in the history
  };

  return (
    <div className="article-detail">
      {article ? (
        <>
          <h1>{article.title}</h1>
          {article.urlToImage && <img src={article.urlToImage} alt="Article image" style={{ maxWidth: '100%' }} />}
          <p>{article.description}</p>
          <p>{article.content}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          <button className="button-go-back" onClick={goBack}>Go Back</button>
        </>
      ) : (
        <p>No article details available</p>
      )}
    </div>
  );
};

export default ArticleDetail;
