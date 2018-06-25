import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm, TreeSelect } from 'antd'
import _ from 'lodash'
import axios from '../../../axiosInst'

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
  {
    title: 'Menu',
    dataIndex: 'menu',
    render: (text, record) => (
      <span>
        {text.map(obj => {
          return <p key={obj._id}>{obj.menu_label}</p>
        })}
      </span>
    ),
  },
]

const converToTreeNode = data => {
  return data.map(obj => {
    if (obj.children) {
      return {
        title: obj.menu_label,
        key: obj._id,
        value: obj._id,
        children: converToTreeNode(obj.children),
      }
    }
    return { title: obj.menu_label, key: obj._id, value: obj._id }
  })
}

class AddRoleForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.props.handleSubmit} layout="inline">
        <FormItem label="Role Name">
          {getFieldDecorator('roleName', {
            rules: [{ required: true, message: 'Please input role name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem>
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
    const { data, treeData } = this.props
    let menu = []
    if (data.length > 0 && data[0].menu.length > 0) {
      menu = data[0].menu.map(obj => {
        return obj._id
      })
    }
    return (
      <Modal
        title="Update Role"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        destroyOnClose
      >
        <Form onSubmit={this.props.handleSubmit} layout="horizontal">
          <FormItem>
            {getFieldDecorator('id', { initialValue: data.length > 0 ? data[0]._id : '' })(
              <Input style={{ display: 'none', visible: false }} />,
            )}
          </FormItem>
          <FormItem label="Role Name" {...formItemLayout}>
            {getFieldDecorator(
              'role_name',
              { initialValue: data.length > 0 ? data[0].role_name : '' },
              {
                rules: [{ required: true, message: 'Please input role name!' }],
              },
            )(<Input />)}
          </FormItem>
          <FormItem label="Menu" {...formItemLayout}>
            {getFieldDecorator('menu', { initialValue: menu })(
              <TreeSelect
                style={{ width: 300 }}
                placeholder="Please select"
                treeData={treeData}
                treeCheckable
              />,
            )}
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
    menu_data: [],
    selectedMenu: [],
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
    axios
      .get('api/admin/menu/getroot')
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          let menu_data = []
          menu_data = converToTreeNode(rs.data)
          this.setState({ menu_data: menu_data })
        } else {
          this.setState({ menu_data: [] })
          alert(rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  showUpdateModal = () => {
    this.setState({ showUpdateModal: true })
  }

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false })
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

  onChangeTreeNode = value => {
    this.setState({ selectedMenu: value })
  }

  render() {
    const { roleList, menu_data, selectedRows, showUpdateModal } = this.state
    return (
      <span>
        <Row>
          <Col span={24}>
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
              treeData={menu_data}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
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
      </span>
    )
  }
}

export default RoleForm
