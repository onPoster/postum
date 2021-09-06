import React from 'react'

import Header from './Header'
import Footer from './Footer'

interface LayoutOpts {
  header?: boolean
}

const defs: LayoutOpts = {
  header: true
}

export default function Layout(jsx: JSX.Element, opts: LayoutOpts = defs) {
  return (
    <div>
      { opts.header && <Header /> }
      { jsx }
      <Footer />
    </div>
  )
}