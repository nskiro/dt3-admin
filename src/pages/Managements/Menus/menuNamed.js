import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { Tabs, Tree, Form, Button, Input, Divider, Popconfirm, Table, Modal, Select } from 'antd';

import PropTypes from 'prop-types';
import moment from 'moment';

import ReactDataGrid from 'react-data-grid';
import axios from '../../../axiosInst';
const _ = require('lodash');

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const ac_get_link = 'api/admin/accesslink/get'

const menu_getroot_link = 'api/admin/menu/getroot'
const menu_get_link = 'api/admin/menu/get'
const menu_getwithlabels_link = 'api/admin/menu/getwithlabels'
const menu_add_link = 'api/admin/menu/add'
const menu_enable_link = 'api/admin/menu/enable/'
const menu_disable_link = 'api/admin/menu/disable/'
const menu_update_link = 'api/admin/menu/update/'

class MenuEditForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      access_link_data: [],
      access_link_selected: '',
      access_link_selected_id: '',

      menu_data: [],
      menu_ref_selected: {},
      menu_parent_label: this.props.data.menu_parent_label,
      menu_parent_id: this.props.data.menu_parent_id,
      expandedKeys: [],
      searchValue: '',
      data_ref: this.props.data,
      autoExpandParent: true,
    }
  }

  onLoadAccessLinks = v => {
    axios
      .get(ac_get_link, { params: v })
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          this.setState({ access_link_data: rs.data })
        } else {
          this.setState({ access_link_data: [] })
          alert(rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  loadMenus = v => {
    axios
      .get(menu_getroot_link, { params: v })
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          let menu_data = []
          let expandedKeys = []
          for (let i = 0; i < rs.data.length; i++) {
            let item = rs.data[i]
            menu_data.push({ title: item.menu_label, key: item._id })
            expandedKeys.push(item._id)
          }
          this.setState({ menu_data: menu_data, expandedKeys: expandedKeys })
        } else {
          this.setState({ menu_data: [], expandedKeys: [] })
          alert(rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentWillMount = () => {
    this.onLoadAccessLinks({record_status:'O'});
    this.loadMenus({});
  }
  handleChange = value => {
    console.log(value)
    this.setState({ access_link_selected: value });
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} dataRef={item} />
    })
  }
  onSelectTreeNode = (selectedKeys, info) => {
    // console.log('selected', info.node.props.dataRef.key);
    let data_ref = this.state.data_ref
    data_ref.menu_parent_label = info.node.props.dataRef.title
    data_ref.menu_parent_id = info.node.props.dataRef.key
    this.setState({ data_ref: data_ref });
  }

  onLoadData = treeNode => {
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return
      }
      setTimeout(() => {
        axios
          .get(menu_get_link, { params: { menu_parent: treeNode.props.eventKey } })
          .then(res => {
            let rs = res.data;
            if (rs.valid) {
              let menu_data = []
              let expandedKeys = this.state.expandedKeys;
              expandedKeys.push(treeNode.props.eventKey);

              for (let i = 0; i < rs.data.length; i++) {
                let item = rs.data[i];
                menu_data.push({ title: item.menu_label, key: item._id });
              }
              treeNode.props.dataRef.children = menu_data;
              console.log(menu_data);
              this.setState({ menu_data: [...this.state.menu_data], expandedKeys: expandedKeys });
            } else {
              this.setState({ menu_data: [] });
              alert(rs.message);
            }
          })
          .catch(err => {
            console.log(err)
          })
        resolve()
      }, 1000)
    })
  }

  menuParentLabelChanged = e => {
    // console.log(e.target.value );
    let data_ref = this.state.data_ref
    data_ref.menu_parent_label = e.target.value
    this.setState({ data_ref: data_ref })
  }
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form
    const { searchValue, expandedKeys, autoExpandParent } = this.state
    const options = this.state.access_link_data.map(d => <Option value={d._id}>{d.name}</Option>)

    let data_ref = this.state.data_ref
    return (
      <Modal
        title="Menu Item Information"
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
                  {getFieldDecorator('id', { initialValue: data_ref._id })(
                    <Input name="id" style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem>
                  {getFieldDecorator('v', { initialValue: data_ref.__v })(
                    <Input name="v" style={{ display: 'none', visible: false }} />,
                  )}
                </FormItem>
              </Col>
              <Col>
                <FormItem>
                  {getFieldDecorator('menu_parent_id', {
                    initialValue: data_ref.menu_parent_id,
                  })(<Input name="menu_parent_id" style={{ display: 'none', visible: false }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={6} sm={6} xs={6}>
                <FormItem label={'MENU TREE'}>
                  {getFieldDecorator('menu_parent', { initialValue: data_ref.menu_parent_id })(
                    <Tree
                      name="menu_parent"
                      loadData={this.onLoadData}
                      onSelect={this.onSelectTreeNode}
                      // expandedKeys={expandedKeys}
                      // autoExpandParent={autoExpandParent}
                    >
                      {this.renderTreeNodes(this.state.menu_data)}
                    </Tree>,
                  )}
                </FormItem>
              </Col>
              <Col md={6} sm={6} xs={6}>
                <Row className="show-grid">
                  <Col md={12} sm={12} xs={12}>
                    <FormItem label={'MENU PARENT'}>
                      {getFieldDecorator('menu_parent_label', {
                        initialValue: this.state.data_ref.menu_parent_label,
                      })(<Input name="menu_parent_label" placeholder="menu parent label" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col md={12} sm={12} xs={12}>
                    <FormItem label={'MENU LABEL'}>
                      {getFieldDecorator('menu_label', { initialValue: data_ref.menu_label })(
                        <Input name="menu_label" placeholder="menu label" />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col md={12} sm={12} xs={12}>
                    <FormItem label={'ACCESS LINK'}>
                      {getFieldDecorator('access_link', { initialValue: data_ref.access_link_id })(
                        <Select
                          showSearch
                          name="access_link"
                          placeholder="access link"
                          onChange={this.handleChange}
                        >
                          {options}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal>
    )
  }
}

MenuEditForm.propTypes = {
  data: PropTypes.object,
}
MenuEditForm.defaultProps = {}

class MenuNamed extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rows: [],
      columns: [
        { title: 'NAME', dataIndex: 'menu_label', key: 'menu_label' },
        { title: 'PARENT', dataIndex: 'menu_parent_label', key: 'menu_parent_label' },
        { title: 'ACCESS LINK', dataIndex: 'access_link_name', key: 'access_link_name' },
        {
          title: 'CREATE DATE',
          dataIndex: 'create_date',
          key: 'create_date',
          render: (text, row) => (
            <span>{text === null ? '' : moment(new Date(text)).format('MM/DD/YYYY HH:mm:ss')}</span>
          ),
        },
        {
          title: 'UPDATE DATE',
          dataIndex: 'update_date',
          key: 'update_date',
          render: (text, row) => (
            <span>{text === null ? '' : moment(new Date(text)).format('MM/DD/YYYY HH:mm:ss')}</span>
          ),
        },
        {
          title: 'STATUS',
          dataIndex: 'record_status',
          key: 'record_status',
          render: (text, row) => <span>{text === 'O' ? 'Đang hoạt động' : 'Ngưng hoạt động'}</span>,
        },
      ],
      button_size: 'small',
      menu_selected: {},
      modalvisible: false,
    }
  }
  onShowEditForm = e => {
    this.setState({ modalvisible: true })
  }
  saveFormRef = formRef => {
    this.formRef = formRef
  }
  onHandleCancel = e => {
    this.setState({ modalvisible: false })
  }

  onHandleLoadMenus = () => {
    axios
      .get(menu_getwithlabels_link, { params: {} })
      .then(res => {
        let rs = res.data
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
  }

  onHandleCreateMenu = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      console.log('values =' + JSON.stringify(values))
      let data = {
        _id: values.id,
        __v: values.v,
        menu_label: values.menu_label,
        menu_parent: values.menu_parent_id,
        access_link: values.access_link,
      }

      if (values.menu_parent_label !== undefined) {
        if (values.menu_parent_label.length === 0) {
          delete data.menu_parent
        }
      }
      console.log(data)
      if (values.id) {
        console.log('call update')
        axios
          .post(menu_update_link + `${values.id}`, data)
          .then(res => {
            console.log(res.data)
            let rs = res.data
            if (rs.valid) {
              form.resetFields()
              this.setState({ modalvisible: false })
              this.onHandleLoadMenus()
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
          .post(menu_add_link, data)
          .then(res => {
            let rs = res.data;
            if (rs.valid) {
              form.resetFields();
              this.setState({ modalvisible: false });
              this.onHandleLoadMenus();
            } else {
              alert(rs.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    })
  }

  onEnableMenu = e => {
    let data = this.state.menu_selected
    if (_.isEmpty(data)) {
      alert('no menu selected');
      return;
    }
    let id = data._id;
    axios
      .post(menu_enable_link + `${id}`, data)
      .then(res => {
        let rs = res.data;
        if (rs.valid) {
          this.onHandleLoadMenus();
        } else {
          alert(rs.message);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  onDisableMenu = e => {
    let data = this.state.menu_selected;
    if (_.isEmpty(data)) {
      alert('no menu selected');
      return;
    }
    let id = data._id
    console.log(JSON.stringify(data))
    axios
      .post(menu_disable_link + `${id}`, data)
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          this.onHandleLoadMenus()
        } else {
          alert(rs.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  componentDidMount = () => {
    this.onHandleLoadMenus()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { button_size } = this.state
    const WapperMenuEditForm = Form.create()(MenuEditForm)
    return (
      <div>
        <div>
          <Button
            type="primary"
            icon="plus-circle"
            value="new"
            size={button_size}
            onClick={this.onShowEditForm}
          >
            new
          </Button>
          <Divider type="vertical" />
          <Button
            icon="edit"
            value="edit"
            size={button_size}
            disabled={_.isEmpty(this.state.menu_selected) ? true : false}
            onClick={this.onShowEditForm}
          >
            {' '}
            edit{' '}
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure enable ?"
            onConfirm={this.onEnableMenu}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon="check-circle"
              size={button_size}
              disabled={_.isEmpty(this.state.menu_selected) ? true : false}
            >
              {' '}
              enable{' '}
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure disable ?"
            onConfirm={this.onDisableMenu}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon="close-circle"
              type="danger"
              size={button_size}
              disabled={_.isEmpty(this.state.menu_selected) ? true : false}
            >
              {' '}
              disable{' '}
            </Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button icon="retweet" size={button_size} onClick={this.onHandleLoadMenus}>
            {' '}
            refesh{' '}
          </Button>
        </div>

        <Table
          rowKey={'_id'}
          size="small"
          bordered
          style={{ marginTop: '5px' }}
          columns={this.state.columns}
          dataSource={this.state.rows}
          // pagination={{ pageSize: 10 }}
          // scroll={{ y: 240 }}
          onRow={record => {
            return {
              onClick: () => {
                this.setState({ menu_selected: record })
                //console.log(record);
              }, // click row
              onMouseEnter: () => {}, // mouse enter row
            }
          }}
        />

        <WapperMenuEditForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.modalvisible}
          onCancel={this.onHandleCancel}
          onCreate={this.onHandleCreateMenu}
          data={this.state.menu_selected}
        />
      </div>
    )
  }
}

export default MenuNamed
