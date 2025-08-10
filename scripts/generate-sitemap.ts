import fs from 'fs';
import { mockAgencies, mockRoutes } from '../src/lib/mock-data';

const generateSitemap = () => {
  const baseUrl = 'https://kamer-ways-connect.com'; // Replace with your actual domain
  const pages = [
    '/',
    '/agencies',
    '/login',
  ];

  const agencyPages = mockAgencies.map(agency => `/agencies/${agency.id}`);
  const bookingPages = mockRoutes.map(route => `/booking/${route.id}`);

  const allPages = [...pages, ...agencyPages, ...bookingPages];

  const sitemap = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages.map(page => `
        <url>
          <loc>${baseUrl}${page}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
