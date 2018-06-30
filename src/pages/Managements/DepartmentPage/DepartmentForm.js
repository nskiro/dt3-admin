import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm, Upload, Spin, message, Icon } from 'antd'
import _ from 'lodash'
import axios from '../../../axiosInst'
import config from '../../../CommonConfig'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const columns = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    render: (text, record) => (
      <span>{text === null ? 'No Avatar' : <img style={{ maxWidth: '40%' }} src={`data:${record.avatar.mimetype};base64,${text.data}`} />}</span>
    )
  },
  {
    title: 'Name',
    dataIndex: 'name',
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

class AddDepartmentForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.props.handleSubmit} layout="horizontal">
        <FormItem label="Dept Name" {...formItemLayout}>
          {getFieldDecorator('departmentName', {
            rules: [{ required: true, message: 'Please input department name!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Department
          </Button>
        </FormItem>
      </Form>
    )
  }
}

class UpdateDepartmentForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
    return (
      <Modal
        title="Update Department"
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
          <FormItem label="Department Name" {...formItemLayout}>
            {getFieldDecorator(
              'departmentName',
              { initialValue: data.length > 0 ? data[0].name : '' },
              {
                rules: [{ required: true, message: 'Please input department name!' }],
              },
            )(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const WrappedAddDepartmentForm = Form.create()(AddDepartmentForm)
const WrappedUpdateDepartmentForm = Form.create()(UpdateDepartmentForm)

class DepartmentForm extends Component {
  state = {
    loading: false,
    departmentList: [],
    selectedRows: [],
    selectedRowKeys: [],
    showUpdateModal: false,
    showAddToRoleModal: false,
  }

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows, selectedRowKeys })
    },
  }

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get('api/admin/dept')
      .then(res => {
        this.setState({ departmentList: res.data, loading: false });
      })
      .catch(err => {
        console.log(err)
      })
  }
  handleSubmit = e => {
    e.preventDefault()
    this.addDepartmentForm.validateFields((err, values) => {
      if (!err) {
        axios
          .post('api/admin/dept/add', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.departmentList]
            temp.push(res.data)
            this.setState({ departmentList: temp })
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
    this.updateDepartmentForm.validateFields((err, values) => {
      if (!err) {
        axios
          .put('api/admin/dept/updateInfo', { ...values })
          .then(res => {
            console.log(res.data)
            let temp = [...this.state.departmentList]
            temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data })
            this.setState({ departmentList: temp })
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
      .delete('api/admin/dept/delete', { data: { departmentIds: this.state.selectedRowKeys } })
      .then(res => {
        console.log(res.data)
        let temp = [...this.state.departmentList]
        temp = temp.filter(obj => !_.includes(res.data, obj._id))
        this.setState({ departmentList: temp, selectedRowKeys: [], selectedRows: [] })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { loading, departmentList, selectedRows, showUpdateModal } = this.state
    return (
      <Row>
        <Col span={8}>
          <WrappedAddDepartmentForm
            ref={node => (this.addDepartmentForm = node)}
            handleSubmit={this.handleSubmit}
          />
          <WrappedUpdateDepartmentForm
            ref={node => (this.updateDepartmentForm = node)}
            visible={showUpdateModal}
            onOk={this.handleUpdate}
            onCancel={this.closeUpdateModal}
            data={selectedRows}
          />
        </Col>
        <Col span={16}>
          <Upload
            name='avatar'
            action={`${config.baseURL}api/admin/dept/updateAvatar`}
            showUploadList={false}
            onChange={(info) => {
              const res = info.file.response;
              const status = info.file.status;
              if (status === 'done') {
                const temp = [...departmentList]
                temp.splice(_.findIndex(temp, { _id: res._id }), 1, { ...res })
                this.setState({ departmentList: temp })
              }
              else if (status === 'error') {
                console.log(res);
              }
            }}
            data={selectedRows[0]}
          >
            <Button icon="upload" size="small" disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}>
              Avatar
            </Button>
          </Upload>
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
          <Spin spinning={loading}>
            <Table
              style={{ marginTop: '5px' }}
              rowKey={'_id'}
              columns={columns}
              dataSource={departmentList}
              rowSelection={this.rowSelection}
              size="small"
              bordered
            />
          </Spin>
        </Col>
      </Row >
    )
  }
}

export default DepartmentForm
