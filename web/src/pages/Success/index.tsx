import React from 'react'
import './styles.css'
import { FiCheckCircle } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

const Success = () => {

    const history = useHistory()
    const navigate = () => {
        history.push('/')
    }

    return (
        <div className="success-content">
            <div className="success-icon"><FiCheckCircle size={300} color='#44ff3b' onClick={navigate} /></div>
            <h3>Ponto de coleta cadastrado com sucesso!</h3>
        </div>
    )
}

export default Success

