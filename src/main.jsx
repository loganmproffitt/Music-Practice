import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Metronome from './components/Metronome.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Metronome />
  </StrictMode>,
)
