import { Transaction } from '../../db/schema';

type SummaryProps = {
  subscriptionId: string;
  address: string;
  transactions: Transaction[];
}[];

export const SummaryEmail = ({ data }: { data: SummaryProps }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        Hey 👋 <br /> We've found some new Transactions.{' '}
      </h2>
      <p style={styles.text}>
        The following transactions have been detected for your subscribed
        addresses:
      </p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Tx Hash</th>
            <th style={styles.th}>From</th>
            <th style={styles.th}>To</th>
            <th style={styles.th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((subscription) => (
            <>
              <tr style={styles.addressRow} key={subscription.subscriptionId}>
                <td
                  colSpan={4}
                  style={{ ...styles.addressCell, textAlign: 'center' }}>
                  <strong>{subscription.address}</strong>
                </td>
              </tr>

              {/* Transactions */}
              {subscription.transactions.length > 0 ? (
                subscription.transactions.map((tx) =>
                  tx.id ? <TransactionRow key={tx.id} tx={tx} /> : null
                )
              ) : (
                <tr>
                  <td colSpan={4} style={styles.noTx}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      <p style={styles.footer}>Made with ❤️ by Kian</p>
    </div>
  );
};

const TransactionRow = ({ tx }: { tx: Transaction }) => (
  <tr>
    <td style={styles.td}>
      <a href={`https://etherscan.io/tx/${tx.id}`} style={styles.link}>
        {tx.id.slice(0, 12)}...
      </a>
    </td>
    <td style={styles.td}>{tx.from.slice(0, 10)}...</td>
    <td style={styles.td}>{tx.to.slice(0, 10)}...</td>
    <td style={styles.td}>{tx.value} ETH</td>
  </tr>
);

// Inline styles for compatibility with email clients
const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: 'auto',
    textAlign: 'center',
    border: '1px solid #444',
  },
  heading: {
    fontSize: '22px',
    marginBottom: '10px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  table: {
    color: '#ffffff',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#222',
    padding: '10px',
    borderBottom: '2px solid #444',
    textAlign: 'left',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #444',
    textAlign: 'center',
  },
  addressRow: {
    backgroundColor: '#1a1a1a',
  },
  addressCell: {
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderBottom: '2px solid #444',
    textAlign: 'left',
  },
  noTx: {
    padding: '10px',
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  link: {
    color: '#0a84ff',
    textDecoration: 'none',
  },
  footer: {
    fontSize: '12px',
    marginTop: '20px',
    opacity: 0.7,
  },
};
