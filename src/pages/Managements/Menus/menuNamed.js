import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { Tabs, Tree, Form, Button, Input, Table, Modal, Select } from 'antd'

import PropTypes from 'prop-types'
import moment from 'moment'

import ReactDataGrid from 'react-data-grid'
import axios from '../../../axiosInst'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const TreeNode = Tree.TreeNode

const ac_get_link = 'api/admin/accesslink/get'
const menu_get_link = 'api/admin/menu/get'

const menu_add_link = 'api/admin/menu/add'
const menu_update_link = 'api/admin/menu/update'

class MenuEditForm extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      access_link_data: [],
      access_link_selected: '',

      menu_data: [],
      menu_seleted: '',
      menu_parent_label: '',
      menu_parent_id: this.props.data.menu_parent_id,
      expandedKeys: [],
      searchValue: '',
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
      .get(menu_get_link, { params: v })
      .then(res => {
        let rs = res.data
        if (rs.valid) {
          let menu_data = []
          for (let i = 0; i < rs.data.length; i++) {
            let item = rs.data[i]
            menu_data.push({ title: item.menu_label, key: item._id })
          }
          console.log(menu_data)
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

  componentDidMount = () => {
    this.onLoadAccessLinks({})
    this.loadMenus({})
  }
  handleChange = value => {
    console.log(value)
    this.setState({ access_link_selected: value })
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
    // console.log('selected', selectedKeys, info);
    this.setState({
      menu_parent_label: info.node.props.dataRef.title,
      menu_parent_id: info.node.props.dataRef.key,
    })
    console.log(info.node.props)
  }
  onLoadData = treeNode => {
    return new Promise(resolve => {
      if (treeNode.props.children) {
        resolve()
        return
      }
      setTimeout(() => {
        //console.log(treeNode.props.eventKey);
        axios
          .get(menu_get_link, { params: { menu_parent: treeNode.props.eventKey } })
          .then(res => {
            let rs = res.data
            if (rs.valid) {
              let menu_data = []
              for (let i = 0; i < rs.data.length; i++) {
                let item = rs.data[i]
                menu_data.push({ title: item.menu_label, key: item._id })
              }
              console.log(menu_data)
              this.setState({ menu_data: [...this.state.menu_data] })
            } else {
              this.setState({ menu_data: [] })
              alert(rs.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
        /*
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];
                this.setState({
                    menu_data: [...this.state.menu_data],
                });
            */
        resolve()
      }, 1000)
    })
  }
  render() {
    const { visible, onCancel, onCreate, form } = this.props
    const { getFieldDecorator } = form

    const { searchValue, expandedKeys, autoExpandParent } = this.state

    const options = this.state.access_link_data.map(d => <Option value={d._id}>{d.name}</Option>)
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
              <Col>
                <FormItem>
                  {getFieldDecorator('menu_parent', {
                    initialValue: this.props.data.menu_parent_id,
                  })(<Input name="menu_parent" style={{ display: 'none', visible: false }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={6} sm={6} xs={6}>
                <FormItem label={'MENU TREE'}>
                  {getFieldDecorator(
                    'menu_parent',
                    { initialValue: this.props.data.menu_parent },
                    {},
                  )(
                    <Tree
                      name="menu_parent"
                      loadData={this.onLoadData}
                      onSelect={this.onSelectTreeNode}
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
                      {getFieldDecorator(
                        'menu_parent_label',
                        { initialValue: this.state.menu_parent_label },
                        {},
                      )(<Input disable name="menu_parent_label" placeholder="menu parent label" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col md={12} sm={12} xs={12}>
                    <FormItem label={'MENU LABEL'}>
                      {getFieldDecorator(
                        'menu_label',
                        { initialValue: this.props.data.menu_label },
                        {},
                      )(<Input name="menu_label" placeholder="menu label" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col md={12} sm={12} xs={12}>
                    <FormItem label={'ACCESS LINK'}>
                      {getFieldDecorator('access_link', {})(
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
      columns: [],
      button_size: 'default',
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

  onHandleCreateMenu = e => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      console.log('values =' + JSON.stringify(values))
      let data = {
        _id: values.id,
        menu_label: values.menu_label,
        menu_parent: values.menu_parent,
        access_link: values.access_link,
      }
      console.log(data)
      if (values.id) {
        console.log('call update')
        /*
              
                axios.post(menu_update_link + `${values.id}`, data)
                    .then((res) => {
                        console.log(res.data);
                        let rs = res.data;
                        if (rs.valid) {
                            form.resetFields();
                            this.setState({ modalvisible: false });
                        } else {
                            alert(rs.message);
                        }

                    })
                    .catch((err) => {
                        console.log(err);
                    });
                    */
      } else {
        console.log('call add')

        axios
          .post(menu_add_link, data)
          .then(res => {
            console.log(res.data)
            let rows = this.state.rows
            // rows.push(res.data);
            // this.setState({ rows: rows });
            form.resetFields()
            this.setState({ modalvisible: false })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { button_size } = this.state
    const WapperMenuEditForm = Form.create()(MenuEditForm)
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
                this.setState({ menu_selected: record })
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
