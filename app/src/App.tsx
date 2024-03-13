import React from 'react'
import './App.css'
import '@farcaster/auth-kit/styles.css'
import { useProfile } from '@farcaster/auth-kit'
import { Header } from './components/Header'
import { MainNoAuth } from './components/MainNoAuth'
import { MainLogged } from './components/MainLogged'
import { FooterNoAuth } from './components/FooterNoAuth'
import { FooterLogged } from './components/FooterLogged'

function App() {
  const { isAuthenticated } = useProfile()

  return (
    <div className="overflow-x-hidden rounded-top-4 pt-2 pt-lg-4">
      <Header />

      {isAuthenticated ? <MainLogged /> : <MainNoAuth />}

      {isAuthenticated ? <FooterLogged /> : <FooterNoAuth />}
    </div>
  )
}

export default App
