import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// TODO fix prettier

import { Campaigns } from './pages/campaigns'
import { Campaign } from './pages/campaign';
import { ApplicationForm } from './pages/application-form';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Campaigns />} />
          <Route path="/campaign/:campaignId" element={<Campaign />} />
          <Route path="/applications/:applicationId" element={<ApplicationForm />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
