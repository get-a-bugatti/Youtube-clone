import { useEffect, useState } from 'react'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header' 
import Home from './pages/Home'
import { Sidebar, PageLoader } from './components'
import { Link, Outlet, useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login as loginUser, logout as logoutUser } from './features/auth/authSlice'
import { addToPlaylists, removeFromPlaylists, setPlaylists } from './features/playlists/playlistSlice'
import axios from 'axios'
import {Suspense} from "react";
import { handleAxiosError } from './api/handleAxiosError'


export async function AppLoader () {
  try {
    const responses = await Promise.all([
      axios.get("/api/v1/users/me"),
      axios.get("/api/v1/playlists/me")
    ])

    return {
      user: responses[0].data.data,
      playlists: responses[1].data.data 
    }
    
  } catch (error) {
    if (error.response?.status === 401) {
      return {
        user: null,
        playlists: []
      };
    }
    
    handleAxiosError(error);
  }

}

function App() {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const {user, playlists} = useLoaderData();

  useEffect(() => {
    if (user) {
      dispatch(loginUser(user));
      dispatch(setPlaylists(playlists));
    } else {
      dispatch(logoutUser());
    }
  }, [user, dispatch])


  return (
    <div className="">
      <Header toggleSidebar={() => setExpanded(prev => !prev)} className="z-100"></Header>
      <Sidebar expanded={expanded}></Sidebar>
      <div className={`${expanded ? "ml-40" : "ml-28"} mt-27`}>
        <Suspense fallback={<PageLoader />}>
          <Outlet></Outlet>
        </Suspense>
      </div>
    </div>
  )
}

export default App
