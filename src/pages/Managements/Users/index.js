import React, { Component } from 'react'
import { Tabs, Form, Button, Input, Collapse } from 'antd'
import { Grid, Row, Col } from 'react-bootstrap'

import Page from 'components/LayoutComponents/Page'

import moment from 'moment'

import ReactDataGrid from 'react-data-grid'
import axios from '../../../axiosInst'

import RowRenderer from '../../../components/Commons/rowrenderer'
import DateFormatter from '../../../components/Commons/dateformatter'

const Panel = Collapse.Panel
const FormItem = Form.Item
const { DateLongFormatter, DateShortFormatter } = DateFormatter

class UserEditForm extends Component {
  render() {
    return (
      <Form>
        <Button> Click me </Button>
      </Form>
    )
  }
}
class UsersForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rows: [],
      columns: [
        { key: 'stt', name: 'STT', editable: false, resizable: true, width: 100 },
        { key: 'username', name: 'USERNAME', editable: false, resizable: true, width: 200 },
        { key: 'fullname', name: 'FULLNNAME', editable: false, resizable: true, width: 200 },
        {
          key: 'last_login',
          name: 'LAST LOGIN',
          editable: false,
          resizable: true,
          width: 200,
          formatter: DateLongFormatter,
        },
        {
          key: 'create_date',
          name: 'CREATE DATE',
          editable: false,
          resizable: true,
          formatter: DateLongFormatter,
        },
        {
          key: 'update_date',
          name: 'UPDATE DATE',
          editable: false,
          resizable: true,
          formatter: DateLongFormatter,
        },
        { key: 'record_status', name: 'STATUS', editable: false, resizable: true },
      ],
    }
  }

  onHandleSearchUser = req => {
    req.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        axios
          .get('/user/search', { params: values })
          .then(res => {
            console.log(res.data)
            this.setState({ rows: res.data })
          })
          .catch(err => {
            console.log(err)
            this.setState({ rows: [] })
          })
      }
    })
  }

  onHandleOk = () => {
    console.log('onHandleOk clicked')
  }

  onHandleCancel = () => {
    console.log('onHandleCancel clicked')
  }

  rowGetter = i => {
    if (i >= 0 && i < this.state.rows.length) {
      return this.state.rows[i]
    }
    return null
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const WrappedUserEditForm = Form.create()(UserEditForm)
    return (
      <Collapse defaultActiveKey={['2']}>
        <Panel header="SEARCH" key="1">
          <Form className="ant-advanced-search-panel ">
            <Grid>
              <Row className="show-grid">
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <FormItem label={'USERNAME'}>
                    {getFieldDecorator('username', {})(
                      <Input type="text" placeholder="username" />,
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                  <FormItem label={'FULLNAME'}>
                    {getFieldDecorator('fullname', {})(<Input placeholder="fullname" />)}
                  </FormItem>
                </Col>
              </Row>
              <div className="ant-advanced-toolbar">
                <Button
                  type="primary"
                  value="new"
                  className="ant-advanced-toolbar-item"
                  onClick={this.onHandleSearchUser}
                >
                  SEARCH
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  value="view"
                  className="ant-advanced-toolbar-item"
                >
                  CLEAR
                </Button>
              </div>
            </Grid>
          </Form>
        </Panel>
        <Panel header="USERS" key="2">
          <div className="ant-advanced-toolbar">
            <Button type="primary" value="new" className="ant-advanced-toolbar-item">
              NEW
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              value="view"
              className="ant-advanced-toolbar-item"
            >
              DETAIL
            </Button>
          </div>
          <ReactDataGrid
            enableCellSelect={true}
            resizable={true}
            columns={this.state.columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.rows.length}
            minHeight={350}
          />
        </Panel>
      </Collapse>
    )
  }
}

class Users extends Component {
  render() {
    const propst = this.props
    const WrappedUserForm = Form.create()(UsersForm)
    return (
      <Page {...propst}>
        <WrappedUserForm {...propst} />
      </Page>
    )
  }
}
export default Users
