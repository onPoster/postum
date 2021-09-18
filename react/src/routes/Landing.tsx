import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../public/logo.png'
import Layout from '../components/Layout'

export default function Landing() {
  return Layout(
    <div>
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title is-1">
              <img src={logo} alt="Postum" width="800"/>
            </p>
            <p className="subtitle is-4">
              Decentralized Forums
            </p>
            <Link className="button" to="/forums">Enter</Link>
          </div>
        </div>
      </section>
    </div>,
    { header: false }
  )
}