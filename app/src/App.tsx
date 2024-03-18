import React, { useEffect, useState } from 'react'
import './App.css'
import '@farcaster/auth-kit/styles.css'
import { Header } from './components/Header'
import { MainNoAuth } from './components/MainNoAuth'
import { MainLogged } from './components/MainLogged'
import { FooterNoAuth } from './components/FooterNoAuth'
import { FooterLogged } from './components/FooterLogged'
import { Stata } from './components/Stata'
import { appStata, IStata } from './service/api'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { selectAuth, setAuthData } from './redux/reducers/authSlice'
import { extractFidFromMessage } from './utils/farcaster'
import { getAuthData } from './service/storage'

function App() {
  const auth = useAppSelector(selectAuth)
  const dispatch = useAppDispatch()

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

    const authData = getAuthData()
    console.log('authData', authData)
    if (authData) {
      const { message, signature, nonce, username } = authData
      dispatch(
        setAuthData({
          isAuthenticated: true,
          message,
          signature,
          nonce,
          username,
          fid: extractFidFromMessage(message),
        }),
      )
    }
  }, [dispatch])

  return (
    <div className="overflow-x-hidden rounded-top-4 pt-2 pt-lg-4">
      <Header />

      {auth.isAuthenticated ? <MainLogged /> : <MainNoAuth />}

      {!auth.isAuthenticated && <Stata stata={stata} />}

      {auth.isAuthenticated ? <FooterLogged /> : <FooterNoAuth />}
    </div>
  )
}

export default App
