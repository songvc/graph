import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Dashboard from './containers/Dashboard'
import NotFound from './NotFound'

class App extends Component {
  render () {
    return <Router>
      <Switch>
        <Route path='/' exact component={Dashboard} />
        {/* <Route path='/map' exact component={Map} /> */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  }
}

export default App
