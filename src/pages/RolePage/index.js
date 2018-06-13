import React, { Component } from 'react';
import Page from 'components/LayoutComponents/Page';
import Helmet from 'react-helmet';
import { Tabs } from 'antd';
import GroupForm from './GroupForm';
import RoleForm from './RoleForm';

const { TabPane } = Tabs;

class RolePage extends Component {
    static defaultProps = {
        pathName: 'Role - Authorization',
        roles: ['administrator'],
    }

    render() {
        const props = this.props
        return (
            <Page {...props}>
                <Helmet title="Role - Authorization" />
                <section className="card">
                    <div className="card-header">
                        <h5 className="mb-0 mr-3 d-inline-block text-black">
                            <strong>Role &amp; Group</strong>
                        </h5>
                    </div>
                    <div className="card-body">
                        <Tabs defaultActiveKey="1" size="small">
                            <TabPane tab="Group" key="1">
                                <GroupForm />
                            </TabPane>
                            <TabPane tab="Role" key="2">
                                <RoleForm />
                        </TabPane>
                        </Tabs>
                    </div>
                </section>
            </Page>
        )
    }
}

export default RolePage;