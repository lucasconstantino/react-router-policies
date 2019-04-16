# React Router Policies [![Build Status](https://travis-ci.org/lucasconstantino/react-router-policies.svg?branch=master)](https://travis-ci.org/lucasconstantino/react-router-policies) [![Greenkeeper badge](https://badges.greenkeeper.io/lucasconstantino/react-router-policies.svg)](https://greenkeeper.io/)

> Decoupled policy system for React Router components

## React Policies

This project is an addendum for the [react-policies](https://github.com/lucasconstantino/react-policies) project which aims to facilitate redirecting upon policy failure. Please, have a look at that project before using this one.

## Install

`npm install --save react-router-policies`

## Tutorial

> You may want to have a look at the [tests](__tests__); they are very explanatory on usage.

In the following example, you won't be able to access path */home* (and therefore component `Home`); any time you try to do so with the `user` property unfilled, you'll get redirected to the */login* path.

```js
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import RoutePolicy from 'react-router-policies'

const authPolicy = RoutePolicy({
  test: props => props.user !== null,
  redirect: '/login',
})

@authPolicy
class Home extends Component {
  static propTypes = {
    user: PropTypes.string
  }

  render () {
    return <div>User: { this.props.user }</div>
  }
}

class App extends Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render () {
    return <div>{ this.props.children }</div>
  }
}

class Login extends Component {
  render () {
    return (
      <div>Login</div>
    )
  }
}

const routes = (
  <Router history={ browserHistory }>
    <Route path='/' component={ App }>
    <Route path='home' component={ Home } />
    <Route path='login' component={ Login } />
  </Router>
)

ReactDOM.render(routes), document.getElementById('root'))
```

### Available options

Besides the default *react-policies* options, you have the following available configurations:

`RoutePolicy(config)`

Config key              | Type   | Description
------------------------|--------|------------
`redirect`              | String | The path where to redirect the user to upon policy failure.
`addRedirectQuery`      | String | Whether or not to send a *redirect* query parameter, so that the target route my send the user back once conditions are met.
`redirectQueryParam`    | String | The parameter to use, given `addRedirectQuery` is true.

## License

Copyright (c) 2016 Lucas Constantino Silva

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
