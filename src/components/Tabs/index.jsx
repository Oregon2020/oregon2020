import React from 'react'
import { Tab } from 'semantic-ui-react'

import Senate from './Senate'

const panes = [
    { menuItem: 'Senate', render: () => <Tab.Pane><Senate /></Tab.Pane> }
]

const Tabs = () => <Tab panes={panes} />

export default Tabs
