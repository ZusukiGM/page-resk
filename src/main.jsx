import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './restlink-platformv2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)