import React from 'react'
import './App.css'

function App() {
  return (
    <div className="overflow-x-hidden rounded-top-4 pt-2 pt-lg-4">
      <header>
        <div className="w-lg-75 mx-2 mx-lg-auto position-relative z-2 px-lg-3 py-0 shadow-5 rounded-3 rounded-lg-pill bg-dark">
          <nav className="navbar navbar-expand-lg navbar-dark p-0" id="navbar">
            <div className="container px-sm-0">
              <a className="navbar-brand d-inline-block w-lg-64" href="#">
                <img src="/logo-1.png" className="h-rem-10" alt="..." />{' '}
                <span className="mx-1">ClickCaster</span>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav gap-2 mx-lg-auto">
                  {/*<li className="nav-item">*/}
                  {/*  <a className="nav-link rounded-pill" href="/" aria-current="page">*/}
                  {/*    Home*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                  {/*<li className="nav-item">*/}
                  {/*  <a className="nav-link rounded-pill" href="#">*/}
                  {/*    Dashboard*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                  {/*<li className="nav-item">*/}
                  {/*  <a className="nav-link rounded-pill" href="#">*/}
                  {/*    Trade*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                  {/*<li className="nav-item">*/}
                  {/*  <a className="nav-link rounded-pill" href="#">*/}
                  {/*    Stake*/}
                  {/*  </a>*/}
                  {/*</li>*/}
                </ul>
                <div className="navbar-nav align-items-lg-center justify-content-end gap-2 ms-lg-4 w-lg-64">
                  {/*<a className="nav-item nav-link rounded-pill d-none d-lg-block" href="#">*/}
                  {/*  Sign in*/}
                  {/*</a>{' '}*/}
                  {/*<a*/}
                  {/*  href="#"*/}
                  {/*  className="btn btn-sm btn-white bg-dark-hover border-0 rounded-pill w-100 w-lg-auto mb-4 mb-lg-0"*/}
                  {/*>*/}
                  {/*  Get started*/}
                  {/*</a>*/}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="pt-56 pb-10 pt-lg-56 pb-lg-0 mt-n40 position-relative gradient-bottom-right start-indigo middle-purple end-yellow">
          <div className="container">
            <div className="row align-items-center g-10">
              <div className="col-lg-8">
                <h1 className="ls-tight fw-bolder display-3 text-white mb-5">
                  Exchange Web3 users. Connect your Warpcast Frame.
                </h1>
                <p className="w-xl-75 lead text-white">
                  Exchange Web3 traffic with other users connected to the system. The platform allows you to monitor the activity dynamics of your Frames.
                </p>
              </div>
              <div className="col-lg-4 align-self-end">
                <div className="hstack gap-3 justify-content-lg-end">
                  {/*<a*/}
                  {/*  href="https://themes.getbootstrap.com/product/satoshi-web3-and-finance-dashboard-theme"*/}
                  {/*  className="btn btn-lg btn-white rounded-pill bg-dark-hover border-0 shadow-none px-lg-8"*/}
                  {/*>*/}
                  {/*  Purchase now{' '}*/}
                  {/*</a>*/}
                  {/*<a*/}
                  {/*  href="/pages/dashboard.html"*/}
                  {/*  className="btn btn-lg btn-dark rounded-pill border-0 shadow-none px-lg-8"*/}
                  {/*>*/}
                  {/*  Explore more*/}
                  {/*</a>*/}
                </div>
              </div>
            </div>
            <div className="mt-10 d-none d-lg-block pb-5">
              <img src="/preview-1.png" />
            </div>
          </div>
        </div>
      </main>

      <footer className="pt-24 pb-10">
        <div className="container mw-screen-xl">
          <div className="row">
            <div className="col">
              <div className="pe-5">
                <h3 className="h2 text-heading fw-semibold lh-lg mb-3">
                  Let's talk about your Frame.
                </h3>
                <a href="mailto:igor.shadurin@gmail.com" className="h3 text-primary">
                  igor.shadurin@gmail.com
                  <span className="svg-icon svg-align-baseline ms-3">
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-5 mb-7">
            <div className="col">
              <ul className="nav mx-n4">
                <li className="nav-item">
                  <a target="_blank" href="https://twitter.com/ClickCaster" className="nav-link text-lg text-muted text-primary-hover">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a target="_blank" href="https://warpcast.com/clickcaster" className="nav-link text-lg text-muted text-primary-hover">
                    <i className="bi bi-eye"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-auto">
              <p className="text-sm text-muted">&copy; Copyright 2024 ClickCaster</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
