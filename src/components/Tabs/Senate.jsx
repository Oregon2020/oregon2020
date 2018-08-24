import React from 'react'
import {
    Button, Dropdown, FormField, Segment, Table
} from 'semantic-ui-react'

import OR_SENATE from '../../data/or_senate.json'
import sankey from '../Diagrams/Sankey'

const FOLLOW_THE_MONEY_CATEGORIES = {
    'd-cci': { label: 'industry', accessKey: 'General_Industry', nameField: 'General_Industry' },
    'd-ccg': { label: 'sector', accessKey: 'Broad_Sector', nameField: 'Broad_Sector' },
    'd-eid': { label: 'contributor', accessKey: 'Contributor', nameField: 'Contributor' }
}

const BILLS = {}
const BILLS_DROPDOWN_OPTIONS = []
const BILLS_OF_INTEREST = [
    'HB 4155',
    'HB 4145',
    'HJR 203',
    'HB 2355',
    'HB 3464',
    'HB 3391',
    'SB 558',
    'SB 3',
    'HB 2004',
    'SB 1547',
    'SB 1532',
    'SB 932',
    'SB 478',
    'SB 454',
    'HB 2307',
    'SB 941',
    'HB 2177'
]

Object.values(OR_SENATE).forEach((candidate) => {
    candidate.bills.forEach((bill) => {
        const {
            billId, billNumber, office, title
        } = bill
        if (!BILLS[billId]) {
            BILLS[billId] = {
                billNumber,
                office,
                title
            }
            BILLS_DROPDOWN_OPTIONS.push({ text: title, value: billId })
        }
    })
})

class Senate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            bills: Object.values(BILLS).sort((r1, r2) => r1.billNumber > r2.billNumber)
        }
    }

    componentDidMount() {
        this.renderSankey()
    }

    getData = (filter) => {
        const data = {
            nodes: [],
            links: []
        }

        let source
        if (filter && filter.type === 'candidate') {
            source = [[filter.id, OR_SENATE[filter.id]]]
        } else {
            source = Object.entries(Object.assign({}, OR_SENATE))
        }

        for (let i = source.length; i--;) {
            const [candidateId, candidate] = source[i]
            if (!filter || filter.type !== 'bills' || candidate.bills.filter(b => filter.bills.indexOf(b.billId) > -1 && b.vote === 'Y').length) {
                data.nodes.push(
                    {
                        id: candidateId,
                        name: `${candidate.firstName} ${candidate.lastName}`,
                        type: 'candidate',
                        photo: candidate.photo
                    }
                )
                const candidateNodeIdx = data.nodes.length - 1

                Object.entries(FOLLOW_THE_MONEY_CATEGORIES).forEach(([code, { accessKey, nameField }]) => {
                    candidate.finance[code].forEach((record) => {
                        const amount = parseFloat(record.Total_$.Total_$)
                        if (code === 'd-ccg') {
                            if (
                                !filter ||
                                filter.type !== 'sector' ||
                                (filter.type === 'sector' && filter.id === record[accessKey].id)
                            ) {
                                const sectorName = record[accessKey][nameField]
                                let target = data.nodes.findIndex(v => v.name === sectorName)
                                if (target === -1) {
                                    data.nodes.push(
                                        { name: record[accessKey][nameField], type: 'sector', id: record[accessKey].id }
                                    )
                                    target = data.nodes.length - 1
                                }
                                data.links.push({
                                    source: candidateNodeIdx,
                                    target,
                                    value: amount
                                })
                            }
                        }
                    })
                })
            }
        }
        return data
    }

    renderSankey = (filter) => {
        this.setState({ hasFilter: !!filter })
        const data = this.getData(filter)
        sankey({
            container: this.sankeyContainer,
            data,
            size: {
                width: 1200,
                height: 1000
            },
            onNodeClick: this.renderSankey
        })
    }

    render() {
        return (
            <Segment basic>
                <Button
                    primary
                    floated="left"
                    disabled={!this.state.hasFilter}
                    onClick={() => this.renderSankey()}
                >
                    Clear filter
                </Button>
                <div
                    ref={(c) => { this.sankeyContainer = c }}
                    style={{ height: 'auto', width: 1200 }}
                />

                <FormField inline>
                    <label><b>Filter by Bills:</b>&nbsp;</label>
                    <Dropdown
                        multiple
                        search
                        selection
                        options={BILLS_DROPDOWN_OPTIONS}
                        onChange={(e, { value }) => this.renderSankey({ type: 'bills', bills: value })}
                    />
                </FormField>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                Bill Number
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Title
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.entries(this.state.bills).map(([billId, { billNumber, title }]) => (
                            <Table.Row key={billId}>
                                <Table.Cell>{billNumber}</Table.Cell>
                                <Table.Cell>{title}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Segment>
        )
    }
}

export default Senate
