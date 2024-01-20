import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient.ts';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client} >
    <MantineProvider>
    <App />
    </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
)
