jest.unmock('../src')
jest.useRealTimers()

import React from 'react'
import { Route, Router } from 'react-router'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import { mount } from 'enzyme'
import RoutePolicy, { combine } from '../src'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render () {
    return <div>{ this.props.children }</div>
  }
}

const setup = routes => {
  const history = createMemoryHistory()
  const wrapper = mount(
    <Router history={ history }>
      { routes }
    </Router>
  )

  return { history, wrapper }
}

describe('Policy', () => {
  it('should show component if policy validates true', async () => {
    const Dumb = props => (<div>Content</div>)
    const policy = RoutePolicy({
      test: props => true
    })
    const PoliciedComponent = policy(Dumb)

    const { history, wrapper } = setup((
      <Route path="/" component={ App } >
        <Route path="dumb" component={ PoliciedComponent } />
      </Route>
    ))

    expect(wrapper.find(Dumb).length).toBe(0)

    history.push('/dumb')
    await sleep(1)

    expect(wrapper.find(Dumb).length).toBe(1)
  })

  it('should redirect if policy validates false', async () => {
    const Dumb = props => (<div>Content</div>)
    const Login = props => (<div>Login</div>)

    const policy = RoutePolicy({
      test: props => false,
      redirect: '/login',
    })
    const PoliciedComponent = policy(Dumb)

    const { history, wrapper } = setup((
      <Route path="/" component={ App } >
        <Route path="dumb" component={ PoliciedComponent } />
        <Route path="login" component={ Login } />
      </Route>
    ))

    expect(wrapper.find(Dumb).length).toBe(0)

    history.push('/dumb')
    await sleep(1)

    expect(wrapper.find(Dumb).length).toBe(0)
    expect(wrapper.find(Login).length).toBe(1)
  })

  it('should redirect with param for redirect back', async () => {
    const Dumb = props => (<div>Content</div>)
    const Login = props => (<div>Login</div>)

    const policy = RoutePolicy({
      test: props => props.valid,
      redirect: '/login',
      redirectQueryParam: 'redirect',
    })

    const PoliciedComponent = policy(Dumb)

    const { history, wrapper } = setup((
      <Route path="/" component={ App } >
        <Route path="dumb" component={ PoliciedComponent } />
        <Route path="login" component={ Login } />
      </Route>
    ))

    expect(wrapper.find(Dumb).length).toBe(0)

    history.push('/dumb')
    await sleep(1)

    expect(wrapper.find(Dumb).length).toBe(0)
    expect(wrapper.find(Login).length).toBe(1)

    expect(wrapper.find(Login).props().location.pathname).toBe('/login')
    expect(wrapper.find(Login).props().location.query.redirect).toBe('/dumb')
  })

  it('should redirect to first invalid policy\'s config', async () => {
    const Dumb = props => (<div>Content</div>)
    const Home = props => (<div>Home</div>)
    const Login = props => (<div>Login</div>)

    const goHomePolicy = RoutePolicy({
      test: props => false,
      redirect: '/home',
    })

    const goLoginPolicy = RoutePolicy({
      test: props => false,
      redirect: '/login',
    })

    const policy = combine(goHomePolicy, goLoginPolicy)
    const PoliciedComponent = policy(Dumb)

    const { history, wrapper } = setup((
      <Route path="/" component={ App } >
        <Route path="dumb" component={ PoliciedComponent } />
        <Route path="home" component={ Home } />
        <Route path="login" component={ Login } />
      </Route>
    ))

    expect(wrapper.find(Dumb).length).toBe(0)
    expect(wrapper.find(Home).length).toBe(0)
    expect(wrapper.find(Login).length).toBe(0)

    history.push('/dumb')
    await sleep(1)

    expect(wrapper.find(Dumb).length).toBe(0)
    expect(wrapper.find(Home).length).toBe(1)
    expect(wrapper.find(Login).length).toBe(0)
  })
})
