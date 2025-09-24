import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './Store/store.js'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
     domain="dev-6o6xedy4tchn1gdo.us.auth0.com"
     clientId="bzhzXyzGUoI0PcTqiHsPiKJkI4ltUAjA"
     authorizationParams={{
      redirect_uri: window.location.origin
    }}
     >
      <Provider store={store}>
        <App />
      </Provider>,
  </Auth0Provider>
)
