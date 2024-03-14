import React, { useEffect, useState } from 'react'
import './App.css'
import '@farcaster/auth-kit/styles.css'
import { useProfile } from '@farcaster/auth-kit'
import { Header } from './components/Header'
import { MainNoAuth } from './components/MainNoAuth'
import { MainLogged } from './components/MainLogged'
import { FooterNoAuth } from './components/FooterNoAuth'
import { FooterLogged } from './components/FooterLogged'
import { getAuthData } from './service/storage'
import { Stata } from './components/Stata'
import { appStata, IStata } from './service/api'

function App() {
  const profile = useProfile()
  const isAuth = profile.isAuthenticated || getAuthData()

  const defaultAppStata: IStata = {
    users: 0,
    frames: 0,
    all_clicks: 0,
  }
  const [stata, setStata] = useState<IStata>(defaultAppStata)

  async function updateStata() {
    const currentStata = await appStata()
    setStata(currentStata.stata)
  }

  useEffect(() => {
    updateStata().then()
  }, [])

  return (
    <div className="overflow-x-hidden rounded-top-4 pt-2 pt-lg-4">
      <Header />

      {isAuth ? <MainLogged /> : <MainNoAuth />}

      {!isAuth && <Stata stata={stata} />}

      {isAuth ? <FooterLogged /> : <FooterNoAuth />}
    </div>
  )
}

export default App
