import React from 'react'

import posterLogo from '../public/poster-logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <a href="https://github.com/ETHPoster" target="_blank">
              <img src={posterLogo} alt="Github" width="35"/>
            </a>
          </div>
          <div className="level-item">
            <a href="https://github.com/ETHPoster/postum" target="_blank">
              <span>Github</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}