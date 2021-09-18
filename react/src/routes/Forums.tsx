import React from 'react'
import { Link } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import Layout from '../components/Layout'
import { lastUpdated } from '../lib/utils'
import { useForumsQuery } from '../graphql/Forums'

export default function Forums() {
  const { loading, error, data, stopPolling, startPolling } = useForumsQuery()

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

  function Body() {
    if (loading) return (
      <div className="buttons is-centered">
        <button className="button is-white is-large is-loading" disabled/>
      </div>
    )
    if (error) return <span> Error: { error } </span>
    return (
      <table className="table is-fullwidth">
        <tbody>
          { data.forums.map((f: returnTypes.Forum) => { return ForumCard(f)}) }
        </tbody>
      </table>
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
        <Body />
      </div>
    </section>
  )
}