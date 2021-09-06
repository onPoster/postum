import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bulma'

import './App.css'
import Landing from './routes/Landing'
import Forums from './routes/Forums'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/forums" component={Forums} />
      </Switch>
    </Router>
  )
}
