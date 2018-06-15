import React, { Component } from 'react'
import { Tabs, Form } from 'antd'
import Helmet from 'react-helmet'

import Page from 'components/LayoutComponents/Page'

import MenuNamed from './menuNamed'
import AccessLinks from './accessLinks'

const TabPane = Tabs.TabPane;

class Menus extends Component {
  render() {
    const props = this.props
    const WapperAccessLinkForm = Form.create()(AccessLinks)
    const WapperMenusForm = Form.create()(MenuNamed)
    return (
      <Page {...props}>
        <Helmet title="Management Menus  &amp; Links" />
        <section className="card">
          <div className="card-header">
            <h5 className="mb-0 mr-3 d-inline-block text-black">
              <strong>Menus&amp; Links </strong>
            </h5>
          </div>
          <div className="card-body">
            <Tabs>
              <TabPane tab="Access Link" key="1">  <WapperAccessLinkForm /></TabPane>
              <TabPane tab="Menus" key="2"><WapperMenusForm /></TabPane>
            </Tabs>
          </div>
        </section>
      </Page>
    )
  }
}

export default Menus
