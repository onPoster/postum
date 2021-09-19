import React from 'react'
import { Link } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import Layout from '../components/Layout'
import { useForumsQuery } from '../graphql/Forums'
import ForumRow from '../components/ForumRow'

export default function Forums() {
  const { loading, error, data, stopPolling, startPolling } = useForumsQuery()

  function Body() {
    if (loading) return (
      <div className="buttons is-centered">
        <button className="button is-white is-large is-loading" disabled/>
      </div>
    )

    if (error) return <span> Error: { error } </span>
    
    return (
      <table className="table is-fullwidth is-hoverable">
        <tbody>
          { data.forums.map((f: returnTypes.Forum) => { return ForumRow(f)}) }
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