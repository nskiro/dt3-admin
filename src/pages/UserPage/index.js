import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import UserForm from './UserForm'

class UserPage extends Component {
  static defaultProps = {
    pathName: 'User Management',
    roles: ['administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="User Management" />
        <UserForm />
      </Page>
    )
  }
}

export default UserPage
