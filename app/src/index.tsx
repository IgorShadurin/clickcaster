import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './css/main.css'
import './css/utility.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { AuthKitProvider } from '@farcaster/auth-kit'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// todo move config to .env
const config = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: "clickcaster.xyz",
  siweUri: "https://clickcaster.xyz",
};

root.render(
  <React.StrictMode>
    <AuthKitProvider config={config}>
    <App />
    </AuthKitProvider>

  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
