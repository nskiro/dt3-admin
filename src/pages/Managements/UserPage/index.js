import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import UserForm from './UserForm';


class UserPage extends Component {
    static defaultProps = {
        pathName: 'User Management',
        roles: ['administrator'],
    }

    render() {
        const props = this.props
        return (
            <Page {...props}>
                <Helmet title="User Management" />
                <section className="card">
                    <div className="card-header">
                        <h5 className="mb-0 mr-3 d-inline-block text-black">
                            <strong>User &amp; Authorization</strong>
                        </h5>
                    </div>
                    <div className="card-body">
                        <UserForm />
                    </div>
                </section>
            </Page>
        )
    }
}

export default UserPage;