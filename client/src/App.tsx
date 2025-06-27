import Chat from './components/Chat'
import Game from './components/Game'

function App() {
  return (
    <div className='min-h-screen bg-indigo-50 overflow-hidden'>
      <div className='w-full max-w-screen-md mx-auto px-4 py-6'>
        <Game/>
        <Chat/>
      </div>
    </div>
  )
}

export default App
