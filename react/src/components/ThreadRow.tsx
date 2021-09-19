import React from 'react'
import { Link } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import { lastUpdated } from '../lib/utils'

interface ThreadRowProps {
  thread: returnTypes.Thread
}

export default function ThreadRow(props: ThreadRowProps) {
  const posts = props.thread.posts
  let updated
  if (posts && posts.length) {
    updated = lastUpdated(posts[0].createdAt)
  }
  if (!updated) {
    updated = lastUpdated(props.thread.createdAt)
  }

  return (
    <tr key={props.thread.id}>
        <th> 
          <Link 
            className="has-text-dark has-text-weight-normal is-size-5" 
            to={`/thread/${props.thread.forum?.id}/${props.thread.id}`}
          >
            { props.thread.title } 
          </Link>
        </th>
        <td className="is-size-5"> { props.thread.posts?.length } </td>
        { updated && 
          <td className="has-text-grey-light is-size-5">
            ~{ updated.ago }{ updated.units }
          </td> 
        }
    </tr>
  )
}