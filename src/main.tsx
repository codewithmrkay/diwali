import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
