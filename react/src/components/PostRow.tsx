import React from 'react'
import { Link } from 'react-router-dom'
import { returnTypes } from '@postum/client'

import { shortAccount, lastUpdated, adminConnected } from '../lib/utils'

function authorConnected(post: returnTypes.Post, account: string | null | undefined): boolean {
  if (!account) { return false }
  return (post.author?.id.toLowerCase() === account.toLowerCase())
}

interface PostRowProps {
  post: returnTypes.Post;
  forum: returnTypes.Forum;
  account: string | null | undefined;
}

export default function PostRow(props: PostRowProps) {
  let updated
  if (props.post && props.post.lastEditedAt) {
    updated = lastUpdated(props.post.lastEditedAt)
  }
  if (!updated) {
    updated = lastUpdated(props.post.createdAt)
  }

  return (
    <tr key={props.post.id}>
      <td> 
        <div className="level has-text-grey-light is-size-6">
          <div className="level-left">
            <p className="level-item">
              <Link to="/">
                { shortAccount(props.post.author?.id) }
              </Link>
            </p>
          </div>
          <div className="level-left">
            { updated && 
              <p className="level-item">
                ~{ updated.ago }{ updated.units }
              </p> 
            }
          </div>
        </div>
        <div className="level is-size-5">
          <div className="level-left">
            <p className="level-item">{ props.post.content }</p>
          </div>
        </div>
        <div className="level">
          <div className="level-left"></div>
          <div className="level-right">
            {adminConnected(props.forum, props.account) && <a className="button is-ghost">Delete</a>}
            {authorConnected(props.post, props.account) && <a className="button is-ghost">Edit</a>}
            <a className="button is-ghost">Reply</a>
          </div>
        </div>
      </td>
    </tr>
  )
}