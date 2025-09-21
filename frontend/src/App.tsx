import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div>
      <h1>Hi! Team hearing development in progress....yooooo</h1>
      <SignupPage/>
      <LoginPage/>
    </div>
  )
}

export default App
