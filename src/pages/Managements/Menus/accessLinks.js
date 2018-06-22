import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { Tabs, Table, Form, Button, Input, Divider, Popconfirm, Modal } from 'antd'
import moment from 'moment'

import axios from '../../../axiosInst'

import PropTypes from 'prop-types'
import DateFormatter from '../../../components/Commons/dateformatter'

const _ = require('lodash')

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
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    return (
      <Modal
        title={data._id ? 'Edit access link' : 'Create new access link'}
        visible={this.props.visible}
        onOk={this.props.onCreate}
        maskClosable={false}
        onCancel={this.props.onCancel}
        style={{ top: 5, left: 5 }}
      >
        <Form>
          <Grid>
            <Row className="show-grid">
              <Col>
                <FormItem>
                  {getFieldDecorator('id', { initialValue: data._id })(
                    <Input style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem>
                  {getFieldDecorator('v', { initialValue: data.__v })(
                    <Input style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col md={12} sm={12} xs={12}>
                <FormItem label={'Access link name'}>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input access link name!' }],
                    initialValue: data.name,
                  })(<Input placeholder="access link name" />)}
                </FormItem>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={12} sm={12} xs={12}>
                <FormItem label={'Component path'}>
                  { getFieldDecorator('com_view', {
                    rules: [{ required: true, message: 'Please input Component path!' }],
                    initialValue: data.com_view,
                  })(<Input placeholder="Component view path" />)}
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
        { title: 'NAME', dataIndex: 'name' },
        { title: 'COMPONENT PATH', dataIndex: 'com_view' },
        {
          title: 'CREATE DATE',
          dataIndex: 'create_date',
          render: (text, row) => (
            <span>{text === null ? '' : moment(new Date(text)).format('MM/DD/YYYY HH:mm:ss')}</span>
          ),
        },
        {
          title: 'UPDATE DATE',
          dataIndex: 'update_date',
          render: (text, row) => (
            <span>{text === null ? '' : moment(new Date(text)).format('MM/DD/YYYY HH:mm:ss')}</span>
          ),
        },
        { title: 'DESCRIPTION', dataIndex: 'des' },
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
      button_size: 'small',
      access_link_selected: {},
      modalvisible: false,

      expand_search: false,
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  }

  onShowEditForm = e => {
    if (e.target.value === 'new') {
      this.setState({ access_link_selected: {} })
    }
    this.setState({ modalvisible: true })
  }

  onHandleSearch = v => {
    const form = this.props.form
    form.validateFields((err, values) => {
      axios
        .get(ac_get_link, { params: v })
        .then(res => {
          let rs = res.data;
          if (rs.valid) {
            this.setState({ rows: rs.data })
          } else {
            this.setState({ rows: [] })
            alert(rs.message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  onHandleCreateMenu = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        let data = {
          id: values.id,
          v: values.v,
          name: values.name,
          com_view: values.com_view,
          des: values.des,
        }
        console.log(data);
        if (values.id) {
          console.log('call update');
          axios
            .post(ac_update_link + `${values.id}`, data)
            .then(res => {
              let rs = res.data;
              if (rs.valid) {
                form.resetFields();
                this.setState({ modalvisible: false });
              } else {
                alert(rs.message);
              }
            })
            .catch(err => {
              console.log(err);
            })
        } else {
          console.log('call add');
          axios
            .post(ac_add_link, data)
            .then(res => {
              console.log(res.data);
              let rows = this.state.rows;
              rows.push(res.data);
              this.setState({ rows: rows });
              form.resetFields();
              this.setState({ modalvisible: false });
            })
            .catch(err => {
              console.log(err);
            })
        }
      }
    })
  }

  componentDidMount = () => {
    this.onHandleSearch({});
  }

  onhandleCancel = e => {
    this.setState({ modalvisible: false });
  }

  onEnableLink = e => {
    console.log('onEnableMenu');
    let data = this.state.access_link_selected;
    if (_.isEmpty(data)) {
      alert('no access link selected');
      return;
    }
    axios
      .post(ac_enable_link + `${data._id}`, data)
      .then(res => {
        let rs = res.data;
        if (rs.valid) {
          this.onHandleRefesh();
        } else {
          alert(rs.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  onDisableLink = e => {
    console.log('onDisableMenu')
    let data = this.state.access_link_selected
    if (_.isEmpty(data)) {
      alert('no access link  selected');
      return
    }
    axios
      .post(ac_disable_link + `${data._id}`, data)
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          this.onHandleRefesh()
        } else {
          alert(rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  onToggleShowSearchPanel = () => {
    const { expand_search } = this.state
    this.setState({ expand_search: !expand_search })
  }

  onRowSelected = e => {
    console.log(e)
  }

  onHandleRefesh = e => {
    this.onHandleSearch({})
  }
  render() {
    const { button_size } = this.state
    const WrappedAccessLinkEditForm = Form.create()(AccessLinkEditForm)

    return (
      <div>
        <div>
          <Button type="primary" icon="plus-circle" value="new" size={button_size} onClick={this.onShowEditForm} >
            new{' '}
          </Button>
          <Divider type="vertical" />
          <Button icon="edit" value="edit" size={button_size} onClick={this.onShowEditForm}> edit </Button>
          <Divider type="vertical" />
          <Button icon="check-circle" size={button_size} onClick={this.onEnableLink}> 
            {' '}
            enable
          </Button>
          <Divider type="vertical" />
          <Button icon="close-circle" size={button_size} onClick={this.onDisableLink}> disable </Button>
          <Divider type="vertical" />
          <Button icon="retweet" size={button_size} onClick={this.onHandleRefesh}> 
            {' '}
            refesh{' '}
          </Button>
        </div>

        <Table rowKey={record => record._id} size="small" bordered style={{ marginTop: '5px' }} columns={this.state.columns} dataSource={this.state.rows}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ access_link_selected: record })
              }, // click row
              onMouseEnter: () => { }, // mouse enter row
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
