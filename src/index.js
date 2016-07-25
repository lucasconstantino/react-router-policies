import React, { Component } from 'react'
import Policy from 'react-policies'

const RouterPolicy = (...configs) => {
  const config = configs
    .map(config => typeof config === 'function' ? { test: config } : config)
    .reduce((prev, next) => ({ ...prev, ...next }), {})

  const {
    redirect
  } = config

  const failure = async ({ props }) => {
    props.router.replace({ pathname: redirect })
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

export const combine = (...policies) => component => [].concat(policies)
  .reduce((component, policy) => policy(component), component)
