import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bulma'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Web3ReactProvider } from '@web3-react/core'
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { subgraphURI } from '@postum/client'

import './App.css'
import { getLibrary } from './lib/web3Connection'
import { NotificationsData, NotificationsContext } from './components/Notifications'
import Landing from './routes/Landing'
import Forums from './routes/Forums'
import NewForum from './routes/NewForum'
import Forum from './routes/Forum'
import NewThread from './routes/NewThread'
import Thread from './routes/Thread'

const apolloClient = new ApolloClient({
  uri: subgraphURI,
  cache: new InMemoryCache()
})

export default function App() {
  const [notifications, setNotifications] = useState<NotificationsData>({})

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={apolloClient}>
        <NotificationsContext.Provider value={{notifications, setNotifications}}>
          <Router>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/forums" component={Forums} />
              <Route path="/new_forum" component={NewForum} />
              <Route path="/forum/:forumId" component={Forum} />
              <Route path="/new_thread/:forumId" component={NewThread} />
              <Route path="/thread/:forumId/:threadId" component={Thread} />
            </Switch>
          </Router>
        </NotificationsContext.Provider>
      </ApolloProvider>
    </Web3ReactProvider>
  )
}
