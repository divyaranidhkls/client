
import React, { use } from 'react'
import NavigationBar from './components/navigation-bar/NavigationBar'
import PostPage from './components/PostPage/Postpage'

const RootPage = () => {
  return (
    <div>
      <NavigationBar />
      <PostPage />
     
      </div>
  )
}

export default RootPage