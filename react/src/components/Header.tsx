import React from 'react'
import { Link } from 'react-router-dom'

import logoSmall from '../public/logo-small.png'
import Web3Connector from './Web3Connector'

export default function Header() {
  return (
    <nav className="level p-5 m-0">
      <div className="level-left">
        <div className="level-item">
          <Link to="/forums">
            <img src={logoSmall} alt="Postum" width="125"/>
          </Link>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <Web3Connector />
        </div>
      </div>
    </nav>
  )
}