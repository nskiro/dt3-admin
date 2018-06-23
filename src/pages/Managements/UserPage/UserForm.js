import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Table, Divider, Modal, Popconfirm, Select, Tag, Spin } from 'antd';
import _ from 'lodash';
import axios from '../../../axiosIns';


const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

const columns = [
    {
        title: 'User Name',
        dataIndex: 'username'
    }, {
        title: 'Full Name',
        dataIndex: 'fullname'
    }, {
        title: 'Department',
        dataIndex: 'dept'
    }, {
        title: 'Last Login',
        dataIndex: 'last_login',
        render: (text, record) => (
            <span>
                {text === null ? '' : new Date(text).toLocaleDateString("vi-VN")}
            </span>
        )
    }, {
        title: 'Group',
        dataIndex: 'group',
        render: (text, record) => {
            let groupString = text.map((obj) => {
                return <Tag color="#108ee9" key={obj.group_name}>{obj.group_name}</Tag>;
            });
            return (
                <span>
                    {groupString}
                </span>
            )
        }
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
    }
];

class AddUserForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title="New User"
                visible={this.props.visible}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
                destroyOnClose
            >
                <Form layout="horizontal">
                    <FormItem
                        label="User Name"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input user name!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Password"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input password!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Full Name"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('fullname', {
                            rules: [{ required: true, message: 'Please input user full name!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Department"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('dept', {
                            rules: [{ required: true, message: 'Please input department!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form >
            </Modal>
        );
    }
}

class UpdateUserForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return (
            <Modal
                title="Update User Detail"
                visible={this.props.visible}
                onOk={this.props.onOk}
                onCancel={this.props.onCancel}
                destroyOnClose
            >
                <Form layout="horizontal">
                    <FormItem>
                        {getFieldDecorator('id', { initialValue: data.length > 0 ? data[0]._id : '' })(
                            <Input style={{ display: 'none', visible: false }} />
                        )}
                    </FormItem>
                    <FormItem
                        label="User Name"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input user name!' }],
                            initialValue: data.length > 0 ? data[0].username : ''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Password"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input password!' }],
                            initialValue: data.length > 0 ? data[0].password : ''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Full Name"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('fullname', {
                            rules: [{ required: true, message: 'Please input user full name!' }],
                            initialValue: data.length > 0 ? data[0].fullname : ''
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="Department"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('dept', {
                            rules: [{ required: true, message: 'Please input department!' }],
                            initialValue: data.length > 0 ? data[0].dept : ''
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

class AddToGroupForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, groupList } = this.props;
        const userGroup = data.length > 0 ? data[0].group.map((obj) => obj._id) : [];
        return (
            <Modal
                title="Add User To Group"
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
                        {getFieldDecorator('groupId', { initialValue: userGroup })(
                            <Select mode="multiple" >
                                {
                                    groupList.map((group) => {
                                        return <Option value={group._id} key={group._id}>{group.group_name}</Option>;
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

class AddToRoleForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const { data, roleList } = this.props;
        const userRole = data.length > 0 ? data[0].role.map((obj) => obj._id) : [];
        return (
            <Modal
                title="Add Role for User"
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
                        {getFieldDecorator('roleId', { initialValue: userRole })(
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

const WrappedAddUserForm = Form.create()(AddUserForm);
const WrappedUpdateUserForm = Form.create()(UpdateUserForm);
const WrappedAddToGroupForm = Form.create()(AddToGroupForm);
const WrappedAddToRoleForm = Form.create()(AddToRoleForm);

class UserForm extends Component {

    state = {
        userList: [],
        roleList: [],
        groupList: [],
        loading: false,
        selectedRows: [],
        selectedRowKeys: [],
        showAddUserModal: false,
        showUpdateModal: false,
        showAddToRoleModal: false,
        showAddToGroupModal: false,

    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRows, selectedRowKeys });
        }
    };

    componentDidMount() {
        this.setState({ loading: true });
        axios.get('api/admin/user')
            .then((res) => {
                this.setState({ userList: res.data, loading: false });
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('api/admin/group')
            .then((res) => {
                this.setState({ groupList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('api/admin/role')
            .then((res) => {
                this.setState({ roleList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.addUserForm.validateFields((err, values) => {
            if (!err) {
                axios.post('api/admin/user/add', { ...values })
                    .then((res) => {
                        console.log(res.data);
                        let temp = [...this.state.userList];
                        temp.push(res.data);
                        this.setState({ userList: temp });
                        this.closeAddUserModal();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    };

    showAddUserModal = () => {
        this.setState({ showAddUserModal: true });
    }

    closeAddUserModal = () => {
        this.setState({ showAddUserModal: false });
    }

    showUpdateModal = () => {
        this.setState({ showUpdateModal: true });
    }

    closeUpdateModal = () => {
        this.setState({ showUpdateModal: false });
    }

    showAddToGroupModal = () => {
        this.setState({ showAddToGroupModal: true });
    }

    closeAddToGroupModal = () => {
        this.setState({ showAddToGroupModal: false });
    }

    showAddToRoleModal = () => {
        this.setState({ showAddToRoleModal: true });
    }

    closeAddToRoleModal = () => {
        this.setState({ showAddToRoleModal: false });
    }

    handleUpdate = () => {
        this.updateUserForm.validateFields((err, values) => {
            if (!err) {
                axios.put('api/admin/user/update', { ...values })
                    .then((res) => {
                        console.log(res.data);
                        let temp = [...this.state.userList];
                        temp.splice(_.findIndex(temp, { _id: res.data.id }), 1, { ...res.data });
                        this.setState({ userList: temp });
                        this.closeUpdateModal();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                console.log(err);
            }
        });
    }

    handleDelete = () => {
        axios.delete('api/admin/user/delete', { data: { userIds: this.state.selectedRowKeys } })
            .then((res) => {
                console.log(res.data);
                let temp = [...this.state.userList];
                temp = temp.filter((obj) => !_.includes(res.data, obj._id));
                this.setState({ userList: temp, selectedRowKeys: [], selectedRows: [] });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleAddToGroup = () => {
        this.addToGroupForm.validateFields((err, value) => {
            if (!err) {
                axios.put('api/admin/user/addgroup', { ...value })
                    .then((res) => {
                        let temp = [...this.state.userList];
                        temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data });
                        this.setState({ userList: temp });
                        this.closeAddToGroupModal();
                    })
                    .catch((err) => {

                    })
            }
        })
    }

    handleAddToRole = () => {
        this.addToRoleForm.validateFields((err, value) => {
            if (!err) {
                axios.put('api/admin/user/addrole', { ...value })
                    .then((res) => {
                        let temp = [...this.state.userList];
                        temp.splice(_.findIndex(temp, { _id: res.data._id }), 1, { ...res.data });
                        this.setState({ userList: temp });
                        this.closeAddToRoleModal();
                    })
                    .catch((err) => {

                    })
            }
        })
    }

    render() {
        const { loading, userList, groupList, roleList, selectedRows, showAddUserModal, showUpdateModal, showAddToGroupModal, showAddToRoleModal } = this.state;
        return (
            <Row>
                <Col>
                    <WrappedAddUserForm
                        ref={node => this.addUserForm = node}
                        visible={showAddUserModal}
                        onOk={this.handleSubmit}
                        onCancel={this.closeAddUserModal}
                    />
                    <WrappedUpdateUserForm
                        ref={node => this.updateUserForm = node}
                        visible={showUpdateModal}
                        onOk={this.handleUpdate}
                        onCancel={this.closeUpdateModal}
                        data={selectedRows}
                    />
                    <WrappedAddToGroupForm
                        ref={node => this.addToGroupForm = node}
                        visible={showAddToGroupModal}
                        onOk={this.handleAddToGroup}
                        onCancel={this.closeAddToGroupModal}
                        data={selectedRows}
                        groupList={groupList}
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
                <Col span={24}>
                    <Button type="primary" icon="plus-circle" size="small" onClick={this.showAddUserModal}>Add</Button>
                    <Divider type="vertical" />
                    <Button icon="key" size="small" onClick={this.showAddToRoleModal} disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}>Role</Button>
                    <Divider type="vertical" />
                    <Button icon="team" size="small" onClick={this.showAddToGroupModal} disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}>Group</Button>
                    <Divider type="vertical" />
                    <Button icon="edit" size="small" onClick={this.showUpdateModal} disabled={selectedRows.length === 0 || selectedRows.length > 1 ? true : false}>Edit</Button>
                    <Divider type="vertical" />
                    <Popconfirm title="Are you sure delete?" onConfirm={this.handleDelete} okText="Yes" cancelText="No">
                        <Button icon="close" type="danger" size="small" disabled={selectedRows.length === 0 ? true : false}>Delete</Button>
                    </Popconfirm>
                    <Spin spinning={loading}>
                        <Table style={{ marginTop: '5px' }} size="small" bordered rowKey={'_id'} columns={columns} dataSource={userList} rowSelection={this.rowSelection} />
                    </Spin>
                </Col>
            </Row>
        )
    }
}

export default UserForm;