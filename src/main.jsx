import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const created = ({gl}) => {
    gl.setClearColor('#87CEEB', 1)
}

root.render(
    <>
        <Canvas
            onCreated={ created }>
            <Experience/>
        </Canvas>
    </>
) 