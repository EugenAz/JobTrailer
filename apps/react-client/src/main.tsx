import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { API_URL } from './utils/env';
import { Layout } from './components/layout';
import { Campaigns } from './pages/campaigns';
import { Campaign } from './pages/campaign';
import { EditApplication } from './pages/edit-application';
import { AddApplication } from './pages/add-application';
import { AddCampaign } from './pages/add-campaign';
import { EditCampaign } from './pages/edit-campaign';
import { CampaignAnalytics } from './pages/campaign-analytics';
import { Page404 } from './pages/404';

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

// TODO add error boundaries

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout page={<Campaigns />} />} />
          <Route
            path="/new-campaign"
            element={<Layout page={<AddCampaign />} />}
          />
          <Route
            path="/campaign/:campaignId/edit"
            element={<Layout page={<EditCampaign />} />}
          />
          <Route
            path="/campaign/:campaignId"
            element={<Layout page={<Campaign />} />}
          />
          <Route
            path="/campaign/:campaignId/analytics"
            element={<Layout page={<CampaignAnalytics />} />}
          />
          <Route
            path="/application/:applicationId"
            element={<Layout page={<EditApplication />} />}
          />
          <Route
            path="/campaign/:campaignId/new-application"
            element={<Layout page={<AddApplication />} />}
          />
          <Route path="/404" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
