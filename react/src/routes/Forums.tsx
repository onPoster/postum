import React from 'react'
import { store } from 'state-pool'

import Layout from '../components/Layout'

export default function Forums() {
  store.setState("headerVisible", true)
  
  return Layout(
    <div>
      Placeholder
    </div>
  )
}