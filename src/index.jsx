import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'

import CONFIG from './config'
import App from './App'

import './semantic/src/semantic.less'
import './styles/base.less'

ReactDOM.render(
    <App />,
    document.getElementById('App')
)

if (!CONFIG.DEBUG) {
    // Google Analytics
    if (CONFIG.GA_TOKEN) {
        ReactGA.initialize(CONFIG.GA_TOKEN)
    }
}
