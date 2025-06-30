import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SocketProvider from './contexts/SocketProvider'
import Lobby from './pages/Lobby'
import Game from './pages/Game'

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Lobby/>}/>
          <Route path='/game' element={<Game/>}/>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
