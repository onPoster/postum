import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [mobileNavActive, setMobileNavActive] = useState("")

  function toggleMobileNav() {
    if (mobileNavActive === "") {
      setMobileNavActive(" is-active")
    } else {
      setMobileNavActive("")
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">Postum</Link>
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
  )
}