import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description: string;
  keywords?: string | string[];
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterCreator?: string;
}

const SEO: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard,
  twitterCreator,
}) => {
  const keywordString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return (
    <Helmet>
      <title>{title} | GlobalBush Quick Ride</title>
      <meta name="description" content={description} />
      {keywordString && <meta name="keywords" content={keywordString} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard || 'summary_large_image'} />
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export const HelmetWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default SEO;
