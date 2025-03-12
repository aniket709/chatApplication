import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router'
import MyRoute from './Config/MyRoute.jsx'
import { Toaster } from 'react-hot-toast';  
import { ChatProvider } from './Context/ChatContext.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>
    <ChatProvider>
    <MyRoute/>
    </ChatProvider>
    <Toaster/>
    </BrowserRouter>
  </React.StrictMode>,
)
