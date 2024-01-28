import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { ApolloProvider } from '@apollo/client';
import { client } from './apolloClient.ts';
import Home from './pages/Home.tsx';
import {RouterProvider,createBrowserRouter} from "react-router-dom"

const router =createBrowserRouter([{path:"/",element:<Home/>}])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client} >
 
    <MantineProvider>
    <RouterProvider router={router} />
    <App />
    </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>,
)

