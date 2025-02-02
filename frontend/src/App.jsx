import { useState } from 'react'
import WelcomeSection from './components/WelcomeSection'
import ChatSection from './components/ChatSection'
import './App.css'
import './styles/components.css'

function App() {
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="app">
      {!showChat ? (
        <WelcomeSection onStart={() => setShowChat(true)} />
      ) : (
        <ChatSection />
      )}
    </div>
  )
}

export default App