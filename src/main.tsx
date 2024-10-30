import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Test from './Test.tsx'
import Box from './Box.tsx'
import Page1 from './Page1.tsx'
import RouteFile from './RouterFile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Test/> */}
    {/* <Box/> */}
    {/* <Page1/> */}
    <RouteFile/>
  </StrictMode>,
)
