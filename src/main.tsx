import React from 'react'
import 'antd/dist/reset.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/main.scss'
import App from './App.tsx'
import './features/localization/i18n.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
