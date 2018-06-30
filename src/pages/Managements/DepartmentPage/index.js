import React, { Component } from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import DepartmentForm from './DepartmentForm'


class UserPage extends Component {
  static defaultProps = {
    pathName: 'Department Management',
    roles: ['administrator'],
  }

    render() {
        const props = this.props
        return (
            <Page {...props}>
                <Helmet title="Department Management" />
                <section className="card">
                    <div className="card-header">
                        <h5 className="mb-0 mr-3 d-inline-block text-black">
                            <strong>Department</strong>
                        </h5>
                    </div>
                    <div className="card-body">
                        <DepartmentForm />
                    </div>
                </section>
            </Page>
        )
    }
}

export default UserPage
