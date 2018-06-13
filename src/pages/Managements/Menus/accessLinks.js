import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { Tabs, Table, Form, Button, Input, Pagination, Icon, Modal } from 'antd'
import moment from 'moment'

import axios from '../../../axiosInst'

import PropTypes from 'prop-types'
import DateFormatter from '../../../components/Commons/dateformatter'

const FormItem = Form.Item
const { TextArea } = Input
const { FormatDateLongType } = DateFormatter

const ac_get_link = 'api/admin/accesslink/get'
const ac_add_link = 'api/admin/accesslink/add'
const ac_update_link = 'api/admin/accesslink/update/'
const ac_enable_link = 'api/admin/accesslink/enable/'
const ac_disable_link = 'api/admin/accesslink/disable/'

class AccessLinkEditForm extends Component {
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        title="ACCESS LINK"
        visible={visible}
        onOk={onCreate}
        maskClosable={false}
        onCancel={onCancel}
        style={{ top: 5, left: 5 }}
      >
        <Form>
          <Grid>
            <Row className="show-grid">
              <Col>
                <FormItem>
                  {getFieldDecorator('id', { initialValue: this.props.data._id })(
                    <Input name="id" style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem>
                  {getFieldDecorator('v', { initialValue: this.props.data._v })(
                    <Input name="v" style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <FormItem label={'Access link name'}>
                  {getFieldDecorator('name', { initialValue: this.props.data.name }, {})(
                    <Input name="name" placeholder="access link name" />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={12} sm={12} xs={12}>
                <FormItem label={'Access link description'}>
                  {getFieldDecorator('des', { initialValue: this.props.data.des }, {})(
                    <TextArea
                      placeholder="access link desciption something !"
                      autosize={{ minRows: 2, maxRows: 6 }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal>
    )
  }
}

AccessLinkEditForm.propTypes = {
  data: PropTypes.object,
}
AccessLinkEditForm.defaultProps = {}

class AccessLinks extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rows: [],
      columns: [
        { title: 'NAME', dataIndex: 'name', key: 'name' },
        { title: 'CREATE DATE', dataIndex: 'create_date', key: 'create_date' },
        { title: 'UPDATE DATE', dataIndex: 'update_date', key: 'update_date' },
        { title: 'DESCRIPTION', dataIndex: 'des', key: 'des' },
        {
          title: 'STATUS',
          dataIndex: 'record_status',
          key: 'record_status',
          render: (text, row, index) => {
            if (text === 'O') {
              return 'Đang hoạt động'
            }
            return 'Ngưng hoạt động'
          },
        },
      ],

      new_status: true,
      edit_status: false,
      enable_status: true,
      disable_status: true,
      button_size: 'default',
      access_link_selected: {},
      modalvisible: false,

      expand_search: false,
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  onShowEditForm = e => {
    console.log('onAddMenu')
    this.setState({ modalvisible: true })
  }

  onHandleSearch = v => {
    const form = this.props.form
    form.validateFields((err, values) => {
      axios
        .get(ac_get_link, { params: v })
        .then(res => {
          let rs = res.data
          if (rs.valid) {
            this.setState({ rows: rs.data })
          } else {
            this.setState({ rows: [] })
            alert(rs.message)
          }
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  onHandleCreateMenu = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      console.log('values =' + JSON.stringify(values))
      let data = {
        _id: values.id,
        name: values.name,
        des: values.des,
      }
      console.log(data)
      if (values.id) {
        console.log('call update')
        axios
          .post(ac_update_link + `${values.id}`, data)
          .then(res => {
            console.log(res.data)
            let rs = res.data
            if (rs.valid) {
              form.resetFields()
              this.setState({ modalvisible: false })
            } else {
              alert(rs.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log('call add')
        axios
          .post(ac_add_link, data)
          .then(res => {
            console.log(res.data)
            let rows = this.state.rows
            rows.push(res.data)
            this.setState({ rows: rows })
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  componentDidMount = () => {
    this.onHandleSearch({})
  }

  onhandleCancel = e => {
    this.setState({ modalvisible: false })
  }

  onEditMenu = e => {
    console.log('onEditMenu')
  }

  onEnableMenu = e => {
    console.log('onEnableMenu')
  }

  onDisableMenu = e => {
    console.log('onDisableMenu')
  }

  onToggleShowSearchPanel = () => {
    const { expand_search } = this.state
    this.setState({ expand_search: !expand_search })
  }

  onRowSelected = e => {
    console.log(e)
  }
  render() {
    const { button_size } = this.state
    const WrappedAccessLinkEditForm = Form.create()(AccessLinkEditForm)

    return (
      <div>
        <div>
          <Button value="new" size={button_size} onClick={this.onShowEditForm}>
            NEW
          </Button>
          <Button value="edit" size={button_size} onClick={this.onShowEditForm}>
            EDIT
          </Button>
          <Button size={button_size} onClick={this.onEnableMenu}>
            ENABLE
          </Button>
          <Button size={button_size} onClick={this.onDisableMenu}>
            DISABLE
          </Button>
        </div>

        <Table
          rowKey={record => record._id}
          className="components-table-demo-nested"
          columns={this.state.columns}
          dataSource={this.state.rows}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 240 }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ access_link_selected: record })
              }, // click row
              onMouseEnter: () => {}, // mouse enter row
            }
          }}
        />

        <WrappedAccessLinkEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.onhandleCancel}
          onCreate={this.onHandleCreateMenu}
          data={this.state.access_link_selected}
        />
      </div>
    )
  }
}

export default AccessLinks
