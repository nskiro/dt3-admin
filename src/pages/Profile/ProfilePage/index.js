import React from 'react'
import { Card, Icon, Avatar, Upload, message, Button } from 'antd'

const { Meta } = Card

const uploadProps = {
    name: 'fileAvatar',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const uploadButton = (
    <Upload {...uploadProps}>
        <Button>
            <Icon type="upload" /> Upload Avatar
        </Button>
    </Upload>
)

class ProfilePage extends React.Component {
    render() {
        return (
            <section className="card">
                <div className="card-header">
                    <h5 className="mb-0 mr-3 d-inline-block text-black">
                        <strong>Profile</strong>
                    </h5>
                </div>
                <div className="card-body">
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                        actions={[uploadButton]}
                    >
                        <Meta
                            // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title="Profile title"
                            description="This is the description"
                        />
                    </Card>
                </div>
            </section>

        )
    }
}

export default ProfilePage