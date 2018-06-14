import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import RoleForm from './RoleForm'

class RolePage extends Component {
  static defaultProps = {
    pathName: 'Role - Authorization',
    roles: ['administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Role - Authorization" />
        <RoleForm />
      </Page>
    )
  }
}

export default RolePage
