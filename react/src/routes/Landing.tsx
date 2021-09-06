import React from 'react'
import { Link } from 'react-router-dom'

import Layout from '../components/Layout'

export default function Landing() {
  return Layout(
    <div>
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <p className="title">
              Postum
            </p>
            <p className="subtitle">
              Decentralized Forums
            </p>
            <Link className="button" to="/forums">Enter</Link>
          </div>
        </div>
      </section>
    </div>
  , { header: false })
}