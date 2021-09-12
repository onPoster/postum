import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { store, useGlobalState } from 'state-pool'
import client, { returnTypes } from '@postum/client'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import Layout from '../components/Layout'
import { lastUpdated } from '../lib/utils'

store.setState("forums", [])
store.setState("cache", {})
store.setState("forum", null)

import { apolloClient } from '../lib/apollo'


const TEN_FORUMS = gql`
  query Forums {
    forums(first: 10) {
      id
    }
  }
`

const NEW_FORUM = gql`
  query NewForum($id: String!) {
    forum(id: $id) {
      id
    }
  }
`

export default function Forums() {
  store.setState("headerVisible", true)
  const [forums, setForums, ] = useGlobalState("forums")
  const [cache, setCache, updateCache] = useGlobalState("cache")
  const [, setForum, ] = useGlobalState("forum")

  const { loading, error, data, stopPolling, startPolling } = useQuery(
    TEN_FORUMS
  )

  console.log('data', data)
  
  useEffect(() => {
    client.query.allForums(25, 0)
      .then((queriedForums) => {
        setForums(queriedForums)
      }
    )

    if (data) {
      const newForum = {
        id: '12345',
        title: "NEW FORUM",
        admins: ["54321"]
      }
      apolloClient.writeQuery({
        query: TEN_FORUMS,
        data: { forums: [...data.forums, newForum]}
      })
    
      const newData = apolloClient.readQuery({ query: TEN_FORUMS })
    
      console.log('newData', newData, data)
    }
  }, [])

  function ForumCard(forum: returnTypes.Forum) {
    const threads = forum.threads
    let updated
    if (threads && threads.length) {
      updated = lastUpdated(threads[0].createdAt)
    }
    if (!updated) {
      updated = lastUpdated(forum.createdAt)
    }
  
    return (
      <tr key={forum.id}>
          <th> 
            <Link 
              className="has-text-dark has-text-weight-normal is-size-5" 
              to={`/forum/${forum.id}`}
              onClick={() => {
                setForum(forum)
              }}
            >
              { forum.title } 
            </Link>
          </th>
          <td className="is-size-5"> { forum.threads?.length } </td>
          { updated && 
            <td className="has-text-grey-light is-size-5">
              ~{ updated.ago }{ updated.units }
            </td> 
          }
      </tr>
    )
  }
  
  return Layout(
    <section className="section">
      <div className="block mb-6">
        <p className="title is-3">Forums</p>
      </div>
      <div className="block">
        <Link className="button is-medium" to="/new_forum">New Forum</Link>
      </div>
      <div className="block">
        <table className="table is-fullwidth">
          <tbody>
            { forums.map((f: returnTypes.Forum) => { return ForumCard(f)}) }
          </tbody>
        </table>
      </div>
    </section>
  )
}