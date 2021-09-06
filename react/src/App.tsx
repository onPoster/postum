import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import 'bulma'

function App() {
  const [mobileNavActive, setMobileNavActive] = useState("")

  function toggleMobileNav() {
    if (mobileNavActive === "") {
      setMobileNavActive(" is-active")
    } else {
      setMobileNavActive("")
    }
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">Postum</a>
          <a className={"navbar-burger" + mobileNavActive} onClick={() => toggleMobileNav()}>
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
        <div className={"navbar-menu" + mobileNavActive}>
          <div className="navbar-end">
            <div className="navbar-item">
              <a className="button">
                Connect
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">
              Postum
            </p>
            <p className="subtitle">
              Decentralized Forums
            </p>
            <a className="button" href="/forums">Enter</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="content has-text-centered">
          <a href="https://github.com/ETHPoster/postum" target="_blank">
            Github
          </a>
        </div>
      </footer>
    </div>
  )
}

function Napp() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <a type="button" className="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </a>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
