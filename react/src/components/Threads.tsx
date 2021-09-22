import React from 'react'
import { useParams } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import { useThreadsQuery } from '../graphql/Threads'
import ThreadRow from './ThreadRow'

export default function Threads() {
  const { forumId } = useParams<{ forumId: string }>()
  const { loading, error, data } = useThreadsQuery(forumId)
  
  if (loading) return (
    <div className="buttons is-centered">
      <button className="button is-white is-large is-loading" disabled/>
    </div>
  )

  if (error) return (
    <div className="notification is-danger"> 
      Error: { error } 
    </div>
  )

  if (!data || !data.threads) return (
    <div className="notification is-danger">
      Error: couldn't find data
    </div>
  )
  
  return (
    <div className="block">
      <table className="table is-fullwidth is-hoverable">
        <tbody>
          { data.threads.map((t: returnTypes.Thread) => { 
            return <ThreadRow key={t.id} thread={t}/>
          }) }
        </tbody>
      </table>
    </div>
  )
}