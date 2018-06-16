import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm, Select, Tag } from 'antd'
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
    title: 'Group Name',
    dataIndex: 'group_name',
  }, {
    title: 'Role',
    dataIndex: 'role',
    render: (text, record) => {
      let roleString = text.map((obj) => {
        return <Tag color="#87d068" key={obj.role_name}>{obj.role_name}</Tag>;
      });
      return (
        <span>
          {roleString}
        </span>
      )
    }
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

class AddGroupForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.props.handleSubmit} layout="horizontal">
        <FormItem label="Group Name" {...formItemLayout}>
          {getFieldDecorator('groupName', {
            rules: [{ required: true, message: 'Please input group name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Group
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class UpdateGroupForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    return (
      <Modal
        title="Update Group"
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
          <FormItem label="Group Name" {...formItemLayout}>
            {getFieldDecorator(
              'groupName',
              { initialValue: data.length > 0 ? data[0].group_name : '' },
              {
                rules: [{ required: true, message: 'Please input group name!' }],
              },
            )(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

class AddToRoleForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, roleList } = this.props;
    const groupRole = data.length > 0 && data[0].role.length > 0 ? data[0].role.map((obj) => obj._id) : [];
    return (
      <Modal
        title="Add Role for Group"
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
        destroyOnClose
      >
        <Form onSubmit={this.props.handleSubmit} layout="horizontal">
          <FormItem>
            {getFieldDecorator('id', { initialValue: data.length > 0 ? data[0]._id : '' })(
              <Input style={{ display: 'none', visible: false }} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('roleId', { initialValue: groupRole })(
              <Select mode="multiple" >
                {
                  roleList.map((role) => {
                    return <Option value={role._id} key={role._id}>{role.role_name}</Option>;
                  })
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const WrappedAddGroupForm = Form.create()(AddGroupForm)
const WrappedUpdateGroupForm = Form.create()(UpdateGroupForm)
const WrappedAddToRoleForm = Form.create()(AddToRoleForm);

class GroupForm extends Component {
  state = {
    roleList: [],
    groupList: [],
    selectedRows: [],
    selectedRowKeys: [],
    showUpdateModal: false,
    showAddToRoleModal: false
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows, selectedRowKeys })
    },
  }

  componentDidMount() {
    axios
      .get('api/admin/group')
      .then(res => {
        this.setState({ groupList: res.data })
      })
      .catch(err => {
        console.log(err)
      })
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
    this.addGroupForm.validateFields((err, values) => {
      if (!err) {
        axios
          .post('api/admin/group/add', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.groupList]
            temp.push(res.data)
            this.setState({ groupList: temp })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  handleAddToRole = () => {
    this.addToRoleForm.validateFields((err, value) => {
      if (!err) {
        axios.put('api/admin/group/addrole', { ...value })
          .then((res) => {
            let temp = [...this.state.groupList];
            temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data });
            this.setState({ groupList: temp });
            this.closeAddToRoleModal();
          })
          .catch((err) => {

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

  showAddToRoleModal = () => {
    this.setState({ showAddToRoleModal: true })
  }

  closeAddToRoleModal = () => {
    this.setState({ showAddToRoleModal: false })
  }

  handleUpdate = () => {
    this.updateGroupForm.validateFields((err, values) => {
      if (!err) {
        axios
          .put('api/admin/group/update', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.groupList]
            temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data })
            this.setState({ groupList: temp })
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
      .delete('api/admin/group/delete', { data: { groupIds: this.state.selectedRowKeys } })
      .then(res => {
        console.log(res.data)
        let temp = [...this.state.groupList]
        temp = temp.filter(obj => !_.includes(res.data, obj._id))
        this.setState({ groupList: temp, selectedRowKeys: [], selectedRows: [] })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { groupList, roleList, selectedRows, showUpdateModal, showAddToRoleModal } = this.state
    return (
      <Row>
        <Col span={8}>
          <WrappedAddGroupForm
            ref={node => (this.addGroupForm = node)}
            handleSubmit={this.handleSubmit}
          />
          <WrappedUpdateGroupForm
            ref={node => (this.updateGroupForm = node)}
            visible={showUpdateModal}
            onOk={this.handleUpdate}
            onCancel={this.closeUpdateModal}
            data={selectedRows}
          />
          <WrappedAddToRoleForm
            ref={node => this.addToRoleForm = node}
            visible={showAddToRoleModal}
            onOk={this.handleAddToRole}
            onCancel={this.closeAddToRoleModal}
            data={selectedRows}
            roleList={roleList}
          />
        </Col>
        <Col span={16}>
          <Button icon="key" size="small" onClick={this.showAddToRoleModal} disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}>Role</Button>
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
            dataSource={groupList}
            rowSelection={this.rowSelection}
            size="small"
            bordered
          />
        </Col>
      </Row>
    )
  }
}

export default GroupForm
