import React, { Component } from 'react';
import { Tabs, Form, Table, Badge, Menu, Dropdown, Icon, Collapse } from 'antd';

import Page from 'components/LayoutComponents/Page'
import RowRenderer from '../../../components/Commons/rowrenderer';
import DateFormatter from '../../../components/Commons/dateformatter';

import MenuNamed from './menuNamed';
import AccessLinks from './accessLinks';

const Panel = Collapse.Panel;
const { DateLongFormatter, DateShortFormatter } = DateFormatter;

class Menus extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            rows: [],
            columns: [
                { key: 'stt', name: 'STT', editable: false, resizable: true, width: 100 },
                { key: 'username', name: 'USERNAME', editable: false, resizable: true, width: 200 },
                { key: 'fullname', name: 'FULLNNAME', editable: false, resizable: true, width: 200 },
                { key: 'last_login', name: 'LAST LOGIN', editable: false, resizable: true, width: 200, formatter: DateLongFormatter },
                { key: 'create_date', name: 'CREATE DATE', editable: false, resizable: true, formatter: DateLongFormatter },
                { key: 'update_date', name: 'UPDATE DATE', editable: false, resizable: true, formatter: DateLongFormatter },
                { key: 'record_status', name: 'STATUS', editable: false, resizable: true, },
            ]
        };
    }
    render() {
        const props = this.props;
        const WapperAccessLinkForm = Form.create()(AccessLinks);
        const WapperMenusForm = Form.create()(MenuNamed);
        return (<Page {...props}>
            <Collapse accordion>
                <Panel header="ACCESS LINK" key="1">
                    <WapperAccessLinkForm />
                </Panel>
                <Panel header="MENU" key="2">
                    <WapperMenusForm />
                </Panel>
            </Collapse>
        </Page>);

    }
}

export default Menus;