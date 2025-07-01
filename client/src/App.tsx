import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SocketProvider from './contexts/SocketProvider'
import EnterName from './pages/EnterName';
import Room from './pages/Room';

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<EnterName/>}/>
          <Route path='/room/:roomId' element={<Room/>}/>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App
