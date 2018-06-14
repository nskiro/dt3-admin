import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import MenuForm from './MenuForm'

class MenuPage extends Component {
  static defaultProps = {
    pathName: 'Menu Management',
    roles: ['administrator'],
  }

  render() {
    const props = this.props
    return (
      <Page {...props}>
        <Helmet title="Menu Management" />
        <MenuForm />
      </Page>
    )
  }
}

export default MenuPage
