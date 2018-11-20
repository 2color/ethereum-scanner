import Web3 from 'web3'
import fetch from 'isomorphic-unfetch'
import Router, { withRouter } from 'next/router'
import { AragonApp, AppBar, IdentityBadge, Table, TableHeader, TableRow, TableCell, Text, DropDown } from '@aragon/ui'
import BlockRow from '../components/BlockRow'
// import Router from 'next/router'

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io'))
const WEI_TO_ETHER = 1000000000000000000

const BlockTransactions = withRouter(({ transactions, router }) =>
  <AragonApp publicUrl='./static/aragon-ui/'>
    <AppBar title='Aragon Challenge' onTitleClick={() => Router.push('/')}>
      <h1>Block: {router.query.block}</h1>
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
        <h1 className='title'>Transactions</h1>
        <div className='filters'>
          <div className='filterLabel'>
            <span className='label'>Type:</span>
            <DropDown
              items={['All', 'Ether']}
              active={'Ether'}
              onChange={handleTransactionTypeChange}
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
        { transactions.map(tx => TransactionRow(tx)) }
      </Table>
    </div>
  </AragonApp>
)

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

const handleTransactionTypeChange = (e) => {

}
BlockTransactions.getInitialProps = async ({ req, query }) => {
  const block = await web3.eth.getBlock(query.block)

  const txPromises = block.transactions.map(txHash => web3.eth.getTransaction(txHash))
  let transactions = await Promise.all(txPromises)

  // Return only transactions sending Ether
  transactions = transactions.filter(tx => tx.value > 0)

  return { block, transactions }
}

export default BlockTransactions
