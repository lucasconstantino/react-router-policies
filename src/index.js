import React, { Component } from 'react'
import Policy from 'react-policies'

const RouterPolicy = (...configs) => {
  const config = configs
    .map(config => typeof config === 'function' ? { test: config } : config)
    .reduce((prev, next) => ({ ...prev, ...next }), {})

  const {
    failure: _failure = () => true,
    redirect,
    addRedirectQuery = !!config.redirectQueryParam,
    redirectQueryParam = 'redirect',
  } = config

  const _shouldRedirect = info => (async () => _failure({ ...info, redirect }))().then(result => {
    if (!result || result instanceof Error) throw result
    return result
  })

  const failure = async (info) => {
    const { location, router: { replace } } = info.props

    const query = addRedirectQuery && {
      [redirectQueryParam]: `${location.pathname}${location.search}`
    }

    await _shouldRedirect(info)
    replace({ pathname: redirect, query })
  }

  const policy = Policy({ ...config, failure })

  return Composed => {
    const PoliciedComponent = policy(Composed)

    return class RoutePoliciedComponent extends Component {
      static contextTypes = {
        router: React.PropTypes.object,
      }

      render () {
        return <PoliciedComponent { ...this.props } router={ this.context.router } />
      }
    }
  }
}

export default RouterPolicy

export const combine = (...policies) => component => [].concat(policies).reverse()
  .reduce((component, policy) => policy(component), component)
