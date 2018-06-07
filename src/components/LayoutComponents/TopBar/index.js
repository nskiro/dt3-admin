import React from 'react'
import { Button } from 'antd'
import ProfileMenu from './ProfileMenu'
import IssuesHistory from './IssuesHistory'
import ProjectManagement from './ProjectManagement'
import BitcoinPrice from './BitcoinPrice'
import HomeMenu from './HomeMenu'
import LiveSearch from './LiveSearch'
import './style.scss'

class TopBar extends React.Component {
  render() {
    return (
      <div className="topbar">
        {/*<div className="topbar__left">
            <IssuesHistory />
            <ProjectManagement />
            <LiveSearch />
          </div>*/}
        <div className="topbar__right">
          {/*<BitcoinPrice />
          <HomeMenu />*/}
          <ProfileMenu />
        </div>
      </div>
    )
  }
}

export default TopBar
