import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm, Select } from 'antd'
import _ from 'lodash'
import axios from '../../../axiosIns'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const columns = [
  {
    title: 'User Name',
    dataIndex: 'username',
  },
  {
    title: 'Full Name',
    dataIndex: 'fullname',
  },
  {
    title: 'Department',
    dataIndex: 'dept',
  },
  {
    title: 'Last Login',
    dataIndex: 'last_login',
    render: (text, record) => (
      <span>{text === null ? '' : new Date(text).toLocaleDateString('vi-VN')}</span>
    ),
  },
]

class AddUserForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.props.handleSubmit} layout="horizontal">
        <FormItem label="User Name" {...formItemLayout}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input user name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Password" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input password!' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Full Name" {...formItemLayout}>
          {getFieldDecorator('fullname', {
            rules: [{ required: true, message: 'Please input user full name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem label="Department" {...formItemLayout}>
          {getFieldDecorator('dept', {
            rules: [{ required: true, message: 'Please input department!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit">
            Add User
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class UpdateUserForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    return (
      <Modal
        title="Update User Detail"
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
          <FormItem label="User Name" {...formItemLayout}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input user name!' }],
              initialValue: data.length > 0 ? data[0].username : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="Password" {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input password!' }],
              initialValue: data.length > 0 ? data[0].password : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="Full Name" {...formItemLayout}>
            {getFieldDecorator('fullname', {
              rules: [{ required: true, message: 'Please input user full name!' }],
              initialValue: data.length > 0 ? data[0].fullname : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="Department" {...formItemLayout}>
            {getFieldDecorator('dept', {
              rules: [{ required: true, message: 'Please input department!' }],
              initialValue: data.length > 0 ? data[0].dept : '',
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

class AddToGroupForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { data, groupList } = this.props

    return (
      <Modal
        title="Add User To Group"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
      >
        <Form onSubmit={this.props.handleSubmit} layout="horizontal">
          <FormItem>
            {getFieldDecorator('id', { initialValue: data })(
              <Input style={{ display: 'none', visible: false }} />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('groupId')(
              <Select onChange={this.handleGroupChange} mode="multiple">
                {groupList.map(group => {
                  return (
                    <Option value={group._id} key={group._id}>
                      {group.group_name}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const WrappedAddUserForm = Form.create()(AddUserForm)
const WrappedUpdateUserForm = Form.create()(UpdateUserForm)
const WrappedAddToGroupForm = Form.create()(AddToGroupForm)

class UserForm extends Component {
  state = {
    userList: [],
    groupList: [],
    selectedRows: [],
    selectedRowKeys: [],
    showUpdateModal: false,
    showAddToGroupModal: false,
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows, selectedRowKeys })
    },
  }

  componentDidMount() {
    axios
      .get('api/admin/user')
      .then(res => {
        this.setState({ userList: res.data })
      })
      .catch(err => {
        console.log(err)
      })
    axios
      .get('api/admin/group')
      .then(res => {
        this.setState({ groupList: res.data })
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    this.addUserForm.validateFields((err, values) => {
      if (!err) {
        axios
          .post('api/admin/user/add', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.userList]
            temp.push(res.data)
            this.setState({ userList: temp })
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

  showAddToGroupModal = () => {
    this.setState({ showAddToGroupModal: true })
  }

  closeAddToGroupModal = () => {
    this.setState({ showAddToGroupModal: false })
  }

  handleUpdate = () => {
    this.updateUserForm.validateFields((err, values) => {
      if (!err) {
        axios
          .put('api/admin/user/update', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.userList]
            temp.splice(_.findIndex(temp, { _id: res.data.id }), 1, { ...res.data })
            this.setState({ userList: temp })
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
      .delete('api/admin/user/delete', { data: { userIds: this.state.selectedRowKeys } })
      .then(res => {
        console.log(res.data)
        let temp = [...this.state.userList]
        temp = temp.filter(obj => !_.includes(res.data, obj._id))
        this.setState({ userList: temp, selectedRowKeys: [], selectedRows: [] })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const {
      userList,
      groupList,
      selectedRows,
      selectedRowKeys,
      showUpdateModal,
      showAddToGroupModal,
    } = this.state
    return (
      <Row>
        <Col span={10}>
          <WrappedAddUserForm
            ref={node => (this.addUserForm = node)}
            handleSubmit={this.handleSubmit}
          />
          <WrappedUpdateUserForm
            ref={node => (this.updateUserForm = node)}
            visible={showUpdateModal}
            onOk={this.handleUpdate}
            onCancel={this.closeUpdateModal}
            data={selectedRows}
          />
          <WrappedAddToGroupForm
            ref={node => (this.updateUserForm = node)}
            visible={showAddToGroupModal}
            // onOk={this.handleUpdate}
            onCancel={this.closeAddToGroupModal}
            data={selectedRowKeys}
            groupList={groupList}
          />
        </Col>
        <Col span={14}>
          <Button
            icon="team"
            size="small"
            onClick={this.showAddToGroupModal}
            disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}
          >
            Add To Group
          </Button>
          <Divider type="vertical" />
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
            dataSource={userList}
            rowSelection={this.rowSelection}
          />
        </Col>
      </Row>
    )
  }
}

export default UserForm
