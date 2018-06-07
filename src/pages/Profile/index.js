import React from 'react'
import Page from 'components/LayoutComponents/Page'
import Helmet from 'react-helmet'
import ProfilePage from './ProfilePage'

class Profile extends React.Component {
    static defaultProps = {
        pathName: 'Dashboard Alpha',
        roles: ['agent', 'administrator'],
    }

    render() {
        const props = this.props
        return (
            <Page {...props}>
                <Helmet title="Clean UI - Profile" />
                <ProfilePage />
            </Page>
        )
    }
}

export default Profile