import React from 'react'
import { Link } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import { lastUpdated } from '../lib/utils'

export default function ForumRow(forum: returnTypes.Forum) {
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