import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { UserInfoProvider } from './contexts/user.context.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <UserInfoProvider>
          <App />
        </UserInfoProvider>
    </BrowserRouter>
  </StrictMode>,
)
