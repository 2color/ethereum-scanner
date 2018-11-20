import { Button, TableRow, TableCell, Text } from '@aragon/ui'
import Link from 'next/link'

const BlockRow = ({ number, transactions }) =>
  <TableRow key={number}>
    <TableCell>
      <Link href={`/block?block=${number}`}>
        <Button mode='outline'>{number}</Button>
      </Link>
    </TableCell>
    <TableCell>
      <Text>{transactions.length}</Text>
    </TableCell>
  </TableRow>

export default BlockRow
