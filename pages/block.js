import React from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import fetch from 'isomorphic-unfetch'
import Router, { withRouter } from 'next/router'
import { AragonApp, AppBar, IdentityBadge, Table, TableHeader, TableRow, TableCell, Text, DropDown } from '@aragon/ui'
import BlockRow from '../components/BlockRow'

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'))
const WEI_TO_ETHER = 1000000000000000000

// An enum for defining possible filter ttpyes
const FILTER_TYPES = {
  All: 'All',
  Ether: 'Ether'
}
Object.freeze(FILTER_TYPES) // Freeze to ensure immutability

// Map transcations to JSX table rows based on the selected filter
const ROW_FILTER_MAP_FUNCTIONS = {
  [FILTER_TYPES.All]: (transactions) => transactions.map(tx => TransactionRow(tx)),
  [FILTER_TYPES.Ether]: (transactions) => transactions.filter(tx => tx.value > 0).map(tx => TransactionRow(tx))
}

const FILTERS = [
  FILTER_TYPES.All,
  FILTER_TYPES.Ether
]

const initialState = {
  selectedFilter: 0
}

class BlockTransactions extends React.Component {
  static propTypes = {
    transactions: PropTypes.array,
    router: PropTypes.object,
  }
  state = {
    ...initialState
  }
  handleTransactionTypeChange = (selectedFilter) => {
    this.setState({
      selectedFilter
    })
  }
  render () {
    const { transactions, router: { query: { block } } } = this.props
    const { selectedFilter } = this.state
    const rows = ROW_FILTER_MAP_FUNCTIONS[FILTERS[selectedFilter]](transactions)

    return <AragonApp publicUrl='./static/aragon-ui/'>
      <AppBar title='Aragon Challenge' onTitleClick={() => Router.push('/')}>
        <h1>Block: {block}</h1>
      </AppBar>
      <style jsx>{`
        div.container {
          padding: 30px;
        }

        div.filters {
            display: flex;
            flex-wrap: nowrap;
        }

        div.filterLabel {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          white-space: nowrap;
        }

        header {
          display: flex;
          justify-content: space-between;
          flex-wrap: nowrap;
          margin-bottom: 10px;
        }

        header h1 {
          margin-top: 10px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        span.label {
          margin-right: 15px;
          margin-left: 20px;
          font-variant: small-caps;
          text-transform: lowercase;
          font-weight: 600;
        }
    `}</style>
      <div className='container'>
        <header>
          <h1 className='title'>Transactions ({rows.length})</h1>
          <div className='filters'>
            <div className='filterLabel'>
              <span className='label'>Type:</span>
              <DropDown
                items={FILTERS}
                active={selectedFilter}
                onChange={this.handleTransactionTypeChange}
              />
            </div>
          </div>
        </header>
        <Table
          header={
            <TableRow>
              <TableHeader title='TxHash' />
              <TableHeader title='From' />
              <TableHeader title='To' />
              <TableHeader title='Value (Ether)' />
            </TableRow>
          }
        >
          { rows }
        </Table>
      </div>
    </AragonApp>
  }
}

const TransactionRow = ({ hash, transactionIndex, from, to, value }) =>
  <TableRow key={hash}>
    <TableCell>
      <Text>{hash}</Text>
    </TableCell>
    <TableCell>
      <IdentityBadge entity={from} shorten />
    </TableCell>
    <TableCell>
      <IdentityBadge entity={to} shorten />
    </TableCell>
    <TableCell>
      <Text>{value / WEI_TO_ETHER}</Text>
    </TableCell>
  </TableRow>

BlockTransactions.getInitialProps = async ({ req, query }) => {
  const block = await web3.eth.getBlock(query.block)

  const txPromises = block.transactions.map(txHash => web3.eth.getTransaction(txHash))
  let transactions = await Promise.all(txPromises)

  return { block, transactions }
}

export default withRouter(BlockTransactions)
