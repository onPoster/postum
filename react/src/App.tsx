import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bulma'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Web3ReactProvider } from '@web3-react/core'
import { ApolloProvider } from "@apollo/client";

import './App.css'
import { apolloClient } from './lib/apollo'
import { getLibrary } from './lib/web3Connection'
import Landing from './routes/Landing'
import Forums from './routes/Forums'
import NewForum from './routes/NewForum'
import Forum from './routes/Forum'

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={apolloClient}>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/forums" component={Forums} />
            <Route path="/new_forum" component={NewForum} />
            <Route path="/forum/:id" component={Forum} />
          </Switch>
        </Router>
      </ApolloProvider>
    </Web3ReactProvider>
  )
}
