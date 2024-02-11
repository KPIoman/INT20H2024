import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './css/base.css'
import HomePage from './jsx/Home';
import SignUp from './jsx/SignUp';
import Lot from './jsx/Lot';
import LogIn from './jsx/LogIn';
import CollectionPage from './jsx/CollectionPage';
import CollectionList from './jsx/CollectionsList';
import SearchPage from './jsx/SearchPage';
import AddLot from './jsx/AddLot'

const App = () => {
  const [userInfo, setUserInfo] = useState(0)
  // userName, email, password

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage userInfo={userInfo}/>
    },
    {
      path: '/SignUp',
      element: <SignUp userInfo={userInfo} setUserInfo={setUserInfo}/>
    },
    {
      path: '/LogIn',
      element: <LogIn userInfo={userInfo} setUserInfo={setUserInfo}/>
    },
    {
      path: '/lot/:lotId',
      element: <Lot userInfo={userInfo}></Lot>
    },
    {
      path:'/search/:query',
      element: <SearchPage userInfo={userInfo}></SearchPage>
    },
    {
      path: '/collections',
      element: <CollectionList userInfo={userInfo}></CollectionList>
    },
    {
      path: '/collections/:collectionId',
      element: <CollectionPage userInfo={userInfo}></CollectionPage>
    },
    {
      path: '/addLot',
      element: <AddLot userInfo={userInfo}></AddLot>
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
