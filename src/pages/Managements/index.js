import React, { Component } from 'react'
import { Tabs, Form } from 'antd'
import Page from 'components/LayoutComponents/Page'

//
//const MenuNamed = require('./menuNamed');
//const AccessLinks= require('./accessLinks');

class Menu extends Component {
  render() {
    const props = this.props
    return (
      <Page {...props}>
        <div>CREATE MENU MAIN</div>
      </Page>
    )
  }
}

export default Menu
