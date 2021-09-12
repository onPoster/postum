import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import Header from './Header'
import Footer from './Footer'
import { getErrorMessage } from '../lib/web3Connection'

interface LayoutOpts {
  header?: boolean
}

const defs: LayoutOpts = {
  header: true
}

export default function Layout(jsx: JSX.Element, opts: LayoutOpts = defs) {
  const context = useWeb3React<ethers.providers.Web3Provider>()
  const { error, deactivate } = context

  useEffect(() => {}, [error])

  return (
    <div id="layout">
      <div id="top">
        { opts.header && <Header /> }
        { error && 
          <div className="notification is-danger mx-5">
            <button className="delete" onClick={() => { deactivate() }}></button>
            {getErrorMessage(error)}
          </div>
        }
        { jsx }
      </div>
      <Footer />
    </div>
  )
}