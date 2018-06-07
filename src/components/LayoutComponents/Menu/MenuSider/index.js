import React from 'react'
import { connect } from 'react-redux'
import { Menu, Switch, Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { reduce } from 'lodash'
import { setLayoutState } from 'ducks/app'
import 'rc-drawer-menu/assets/index.css'
import './style.scss'

const { Sider } = Layout
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const menuData = [
  {
    title: 'Dashboard Alpha',
    key: 'dashboardAlpha',
    url: '/dashboard/alpha',
    icon: 'icomn icmn-home',
  },
  {
    title: 'Empty Page',
    key: 'emptyPage',
    url: '/pages/empty',
    icon: 'icomn icmn-star-full',
  },
]

const mapStateToProps = (state, props) => ({
  layoutState: state.app.layoutState,
})

@connect(mapStateToProps)
@withRouter
class MenuSider extends React.Component {
  state = {
    menuCollapsed: this.props.layoutState.menuCollapsed,
    themeLight: this.props.layoutState.themeLight,
    selectedKeys: '',
    openKeys: [''],
    settingsOpened: this.props.layoutState.settingsOpened,
  }

  handleClick = e => {
    const { dispatch, isMobile } = this.props
    if (isMobile) {
      // collapse menu on isMobile state
      dispatch(setLayoutState({ menuMobileOpened: false }))
    }
    if (e.key === 'settings') {
      // prevent click and toggle settings block on theme settings link
      dispatch(setLayoutState({ settingsOpened: !this.state.settingsOpened }))
      return
    }
    // set current selected keys
    this.setState({
      selectedKeys: e.key,
    })
  }

  onOpenChange = openKeys => {
    this.setState({
      openKeys: openKeys,
    })
  }

  getPath(data, id, parents = []) {
    let items = reduce(
      data,
      (result, entry) => {
        if (result.length) {
          return result
        } else if (entry.url === id && this.state.selectedKeys === '') {
          return [entry].concat(parents)
        } else if (entry.key === id && this.state.selectedKeys !== '') {
          return [entry].concat(parents)
        } else if (entry.children) {
          let nested = this.getPath(entry.children, id, [entry].concat(parents))
          return nested ? nested : result
        }
        return result
      },
      [],
    )
    return items.length > 0 ? items : false
  }

  getActiveMenuItem = (props, items) => {
    let menuCollapsed = props.layoutState.menuCollapsed
    let selectedKeys = this.state.selectedKeys
    let url = props.location.pathname
    let [activeMenuItem, ...path] = this.getPath(items, !selectedKeys ? url : selectedKeys)

    if (menuCollapsed) {
      path = ['']
    }

    this.setState({
      selectedKeys: activeMenuItem ? activeMenuItem.key : '',
      openKeys: activeMenuItem ? path.map(entry => entry.key) : [],
      menuCollapsed,
    })
  }

  generateMenuPartitions(items) {
    return items.map((menuItem, index) => {
      if (menuItem.children) {
        let subMenuTitle = (
          <span className="menuSider__title-wrap" key={menuItem.key}>
            <span className="menuSider__item-title">{menuItem.title}</span>
            {menuItem.icon && <span className={menuItem.icon + ' menuSider__icon'} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {this.generateMenuPartitions(menuItem.children)}
          </SubMenu>
        )
      }
      return this.generateMenuItem(menuItem)
    })
  }

  generateMenuItem(item) {
    const key = item.key
    const title = item.title
    const url = item.url
    const icon = item.icon
    const disabled = item.disabled
    const { dispatch } = this.props
    return item.divider ? (
      <Divider key={Math.random()} />
    ) : item.url ? (
      <Menu.Item key={key} disabled={disabled}>
        <Link
          to={url}
          onClick={
            this.props.isMobile
              ? () => {
                  dispatch(setLayoutState({ menuCollapsed: false }))
                }
              : undefined
          }
        >
          <span className="menuSider__item-title">{title}</span>
          {icon && <span className={icon + ' menuSider__icon'} />}
        </Link>
      </Menu.Item>
    ) : (
      <Menu.Item key={key} disabled={disabled}>
        <span className="menuSider__item-title">{title}</span>
        {icon && <span className={icon + ' menuSider__icon'} />}
      </Menu.Item>
    )
  }

  onCollapse = (collapsed, type) => {
    const { dispatch } = this.props
    if (type === 'responsive' && this.state.menuCollapsed) {
      return
    }
    dispatch(setLayoutState({ menuCollapsed: !this.state.menuCollapsed }))
  }

  componentDidMount() {
    this.getActiveMenuItem(this.props, menuData)
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.isMobile) {
      this.getActiveMenuItem(newProps, menuData)
    }
    this.setState({
      themeLight: newProps.layoutState.themeLight,
      settingsOpened: newProps.layoutState.settingsOpened,
    })
  }

  render() {
    const { menuCollapsed, selectedKeys, openKeys, themeLight } = this.state
    const { isMobile } = this.props
    const menuItems = this.generateMenuPartitions(menuData)
    const paramsMobile = {
      width: 256,
      collapsible: false,
      collapsed: false,
      onCollapse: this.onCollapse,
    }
    const paramsDesktop = {
      width: 256,
      collapsible: true,
      collapsed: menuCollapsed,
      onCollapse: this.onCollapse,
      breakpoint: 'lg',
    }
    const params = isMobile ? paramsMobile : paramsDesktop
    return (
      <Sider {...params}>
        <div className="menuSider__logo">
          {params.collapsed ? (
            <div className="menuSider__logoContainer menuSider__logoContainer--collapsed">
              <img src="resources/images/ERGObabyLogo-STANDARD.png" alt="" />
            </div>
          ) : (
            <div className="menuSider__logoContainer">
              <img src="resources/images/Ergobaby-logo.png" alt="" />
            </div>
          )}
        </div>
        <Menu
          theme={themeLight ? 'light' : 'dark'}
          onClick={this.handleClick}
          selectedKeys={[selectedKeys]}
          openKeys={openKeys}
          onOpenChange={this.onOpenChange}
          mode="inline"
          className="menuSider__navigation"
        >
          {menuItems}
          <Menu.Item key={'settings'}>
            <span className="menuSider__item-title">Theme Settings</span>
            <span
              className={'icmn icmn-cog menuSider__icon utils__spin-delayed--pseudo-selector'}
            />
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}

export { MenuSider, menuData }
