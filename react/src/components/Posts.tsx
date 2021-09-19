import React from 'react'
import { useParams } from 'react-router-dom'
import { returnTypes } from '@postum/client'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import { usePostsQuery } from '../graphql/Posts'
import PostRow from './PostRow'

interface PostsProps {
  forum: returnTypes.Forum;
}

export default function Posts(props: PostsProps) {
  const { threadId } = useParams()
  const { loading, error, data } = usePostsQuery(threadId)
  const web3Context = useWeb3React<ethers.providers.Web3Provider>()
  const { account } = web3Context
  
  if (loading ) return (
    <div className="buttons is-centered">
      <button className="button is-white is-large is-loading" disabled/>
    </div>
  )

  if (error || web3Context.error ) return (
    <div className="notification is-danger">
      Error: { error || web3Context.error }
    </div>
  )

  if (!data || !data.posts) return (
    <div className="notification is-danger"> 
      Error: couldn't find data 
    </div>
  )
  
  return (
    <div className="block">
      <table className="table is-fullwidth is-hoverable is-striped is-vbordered">
        <tbody>
          { data.posts.map((p: returnTypes.Post) => { 
            return <PostRow 
              key={p.id} 
              post={p} 
              forum={props.forum} 
              account={account}
            />
          }) }
        </tbody>
      </table>
    </div>
  )
}