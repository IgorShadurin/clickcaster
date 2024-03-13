import { SignInButton, StatusAPIResponse, useProfile } from '@farcaster/auth-kit'
import React, { useEffect, useState } from 'react'
import { getAuthData, saveAuthData } from '../service/storage'
import { AuthData } from '../service/api'

export function Header() {
  const profile = useProfile()
  const [authData, setAuthData] = useState<AuthData>()
  const isAuth = profile.isAuthenticated || authData
  const username = profile.profile.username || authData?.username || undefined

  useEffect(() => {
    setAuthData(getAuthData())
  }, [])

  return (
    <header>
      <div className="w-lg-75 mx-2 mx-lg-auto position-relative z-2 px-lg-3 py-0 shadow-5 rounded-3 rounded-lg-pill bg-dark">
        <nav className="navbar navbar-expand-lg navbar-dark p-0" id="navbar">
          <div className="container px-sm-0">
            <a className="navbar-brand d-inline-block w-lg-64" href="/">
              <img src="/logo-1.png" className="h-rem-10" alt="..." /> <span className="mx-1">ClickCaster</span>
            </a>

            <div className={`collapse navbar-collapse`} id="navbarCollapse">
              <ul className="navbar-nav gap-2 mx-lg-auto" />

              <div className="navbar-nav align-items-lg-center justify-content-end gap-2 ms-lg-4 w-lg-64">
                {!isAuth && (
                  <a
                    className="sign-in-header nav-item nav-link rounded-pill d-none d-lg-block"
                    href="#"
                    onClick={e => e.preventDefault()}
                  >
                    <SignInButton
                      onSuccess={(res: StatusAPIResponse) => {
                        const { message, signature, nonce, username } = res
                        if (!message || !signature || !nonce || !username) {
                          console.log('sign in info', res)
                          alert('Incorrect auth information. Cannot sign in.')
                          return
                        }

                        saveAuthData({
                          message,
                          signature,
                          nonce,
                          username,
                        })
                      }}
                    />
                  </a>
                )}

                {isAuth && (
                  <a
                    className="sign-in-header nav-item nav-link rounded-pill d-none d-lg-block"
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      if (window.confirm('Logout?')) {
                        saveAuthData()
                        window.location.reload()
                      }
                    }}
                  >
                    {username && <p>Hello, @{username}</p>}
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
