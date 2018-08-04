import React from 'react'
import { Header, Image, Menu } from 'semantic-ui-react'

import logo from '../images/logo_or.png'

const PageHeader = () => (
    <Menu id="Header" borderless inverted color="green">
        <Menu.Item>
            <Header>
                <Image src={logo} />
                Oregon 2020
            </Header>
        </Menu.Item>
    </Menu>
)

export default PageHeader
