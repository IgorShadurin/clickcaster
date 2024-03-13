import { SignInButton, StatusAPIResponse, useProfile } from '@farcaster/auth-kit'
import React from 'react'
import { saveAuthData } from '../service/storage'

export function Header() {
  const profile = useProfile()
  const {
    isAuthenticated,
    profile: { username },
  } = profile
  return (
    <header>
      <div className="w-lg-75 mx-2 mx-lg-auto position-relative z-2 px-lg-3 py-0 shadow-5 rounded-3 rounded-lg-pill bg-dark">
        <nav className="navbar navbar-expand-lg navbar-dark p-0" id="navbar">
          <div className="container px-sm-0">
            <a className="navbar-brand d-inline-block w-lg-64" href="/app/public">
              <img src="/logo-1.png" className="h-rem-10" alt="..." /> <span className="mx-1">ClickCaster</span>
            </a>

            <div className={`collapse navbar-collapse`} id="navbarCollapse">
              <ul className="navbar-nav gap-2 mx-lg-auto" />

              <div className="navbar-nav align-items-lg-center justify-content-end gap-2 ms-lg-4 w-lg-64">
                <a
                  className="sign-in-header nav-item nav-link rounded-pill d-none d-lg-block"
                  href="#"
                  onClick={e => e.preventDefault()}
                >
                  {!isAuthenticated && (
                    <SignInButton
                      onSuccess={(res: StatusAPIResponse) => {
                        const { message, signature, nonce } = res
                        if (!message || !signature || !nonce) {
                          console.log('sign in info', res)
                          alert('Incorrect auth information. Cannot sign in.')
                          return
                        }

                        saveAuthData({
                          message,
                          signature,
                          nonce,
                        })
                      }}
                    />
                  )}

                  {username && <p>Hello, @{username}</p>}
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
