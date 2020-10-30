/* global it */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Map />, div)
  ReactDOM.unmountComponentAtNode(div)
})
