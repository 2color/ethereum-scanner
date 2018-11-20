import Web3 from 'web3'
import { AragonApp, AppBar, Table, TableHeader, TableRow } from '@aragon/ui'
import BlockRow from '../components/BlockRow'

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'))

const LastBlocks = ({ blocks }) =>
  <AragonApp publicUrl='./static/aragon-ui/'>
    <AppBar title='Aragon Challenge'>
      <h2>Last 10 blocks</h2>
    </AppBar>
    <style jsx>{`
      div {
        padding: 30px;
      }
      tr {
        cursor: pointer;
      }
    `}</style>
    <div>
      <Table
        header={
          <TableRow>
            <TableHeader title='Block Height' />
            <TableHeader title='Transaction Count (All)' />
          </TableRow>
        }
      >
        {blocks.map(block => BlockRow(block))}
      </Table>
    </div>
  </AragonApp>

// Fetchs required data for component
LastBlocks.getInitialProps = async ({ req }) => {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  const blockPromises = []

  for (var i = 0; i < 10; i++) {
    const block = latestBlockNumber - i
    blockPromises.push(web3.eth.getBlock(block, true))
    // TODO: It's probably more efficient to just fetch the transcation count
    // blockPromises.push(web3.eth.getBlockTransactionCount(block))
  }

  const blocks = await Promise.all(blockPromises)

  return { blocks }
}

export default LastBlocks
