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
    title: 'Group Name',
    dataIndex: 'group_name',
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

const WrappedAddGroupForm = Form.create()(AddGroupForm)
const WrappedUpdateGroupForm = Form.create()(UpdateGroupForm)

class GroupForm extends Component {
  state = {
    groupList: [],
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

  showUpdateModal = () => {
    this.setState({ showUpdateModal: true })
  }

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false })
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
    const { groupList, selectedRows, showUpdateModal } = this.state
    return (
      <Row>
        <Col span={10}>
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
            dataSource={groupList}
            rowSelection={this.rowSelection}
          />
        </Col>
      </Row>
    )
  }
}

export default GroupForm
