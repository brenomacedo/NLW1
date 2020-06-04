import React from 'react'
import Home from './pages/Home'
import Success from './pages/Success'
import CreatePoint from './pages/CreatePoint'
import { BrowserRouter, Route } from 'react-router-dom'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path='/' exact />
            <Route component={CreatePoint} path='/create' />
            <Route component={Success} path='/success' />
        </BrowserRouter>
    )
}

export default Routes