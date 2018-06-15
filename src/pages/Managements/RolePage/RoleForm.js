import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm } from 'antd'
import _ from 'lodash'
import axios from '../../../axiosIns'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const columns = [
  {
    title: 'Role Name',
    dataIndex: 'role_name',
  },
  {
    title: 'Created Date',
    dataIndex: 'create_date',
    render: (text, record) => (
      <span>{text === null ? '' : new Date(text).toLocaleDateString('vi-VN')}</span>
    ),
  },
  {
    title: 'Update Date',
    dataIndex: 'update_date',
    render: (text, record) => (
      <span>{text === null ? '' : new Date(text).toLocaleDateString('vi-VN')}</span>
    ),
  },
]

class AddRoleForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.props.handleSubmit} layout="horizontal">
        <FormItem label="Role Name" {...formItemLayout}>
          {getFieldDecorator('roleName', {
            rules: [{ required: true, message: 'Please input role name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Role
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class UpdateRoleForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    return (
      <Modal
        title="Update Role"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
      >
        <Form onSubmit={this.props.handleSubmit} layout="horizontal">
          <FormItem>
            {getFieldDecorator('id', { initialValue: data.length > 0 ? data[0]._id : '' })(
              <Input style={{ display: 'none', visible: false }} />,
            )}
          </FormItem>
          <FormItem label="Role Name" {...formItemLayout}>
            {getFieldDecorator(
              'roleName',
              { initialValue: data.length > 0 ? data[0].role_name : '' },
              {
                rules: [{ required: true, message: 'Please input role name!' }],
              },
            )(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const WrappedAddRoleForm = Form.create()(AddRoleForm)
const WrappedUpdateRoleForm = Form.create()(UpdateRoleForm)

class RoleForm extends Component {
  state = {
    roleList: [],
    selectedRows: [],
    selectedRowKeys: [],
    showUpdateModal: false,
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows, selectedRowKeys })
    },
  }

  componentDidMount() {
    axios
      .get('api/admin/role')
      .then(res => {
        this.setState({ roleList: res.data })
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    this.addRoleForm.validateFields((err, values) => {
      if (!err) {
        axios
          .post('api/admin/role/add', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.roleList]
            temp.push(res.data)
            this.setState({ roleList: temp })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  showUpdateModal = () => {
    this.setState({ showUpdateModal: true })
  }

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false })
  }

  handleUpdate = () => {
    this.updateRoleForm.validateFields((err, values) => {
      if (!err) {
        axios
          .put('api/admin/role/update', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.roleList]
            temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data })
            this.setState({ roleList: temp })
            this.closeUpdateModal()
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        console.log(err)
      }
    })
  }

  handleDelete = () => {
    axios
      .delete('api/admin/role/delete', { data: { roleIds: this.state.selectedRowKeys } })
      .then(res => {
        console.log(res.data)
        let temp = [...this.state.roleList]
        temp = temp.filter(obj => !_.includes(res.data, obj._id))
        this.setState({ roleList: temp, selectedRowKeys: [], selectedRows: [] })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { roleList, selectedRows, showUpdateModal } = this.state
    return (
      <Row>
        <Col span={10}>
          <WrappedAddRoleForm
            ref={node => (this.addRoleForm = node)}
            handleSubmit={this.handleSubmit}
          />
          <WrappedUpdateRoleForm
            ref={node => (this.updateRoleForm = node)}
            visible={showUpdateModal}
            onOk={this.handleUpdate}
            onCancel={this.closeUpdateModal}
            data={selectedRows}
          />
        </Col>
        <Col span={14}>
          <Button
            icon="edit"
            size="small"
            onClick={this.showUpdateModal}
            disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}
          >
            Edit
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete?"
            onConfirm={this.handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon="close"
              type="danger"
              size="small"
              disabled={selectedRows.length === 0 ? true : false}
            >
              Delete
            </Button>
          </Popconfirm>
          <Table
            style={{ marginTop: '5px' }}
            rowKey={'_id'}
            columns={columns}
            dataSource={roleList}
            rowSelection={this.rowSelection}
            size="small"
            bordered
          />
        </Col>
      </Row>
    )
  }
}

export default RoleForm
