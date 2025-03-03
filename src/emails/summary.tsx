import { SubscriptionWithTransactions } from '../types';

export const Summary = ({ data }: { data: SubscriptionWithTransactions }) => {
  const [sub] = data;

  return (
    <html>
      <body
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#121212',
          color: '#e1e1e1',
          fontFamily: 'Inter, Helvetica, Arial, sans-serif',
        }}>
        <div
          style={{
            width: 'min(90%, 80ch)',
            padding: '2rem',
            borderRadius: '10px',
            background: '#1e1e1e',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}>
          <h1
            style={{
              marginBottom: '0.5rem',
            }}>
            Summary for {sub.email}
          </h1>
          <hr
            style={{
              border: 'none',
              height: '2px',
              background: '#ff9800',
              marginBottom: '1rem',
            }}
          />

          <h4 style={{ color: '#ffcc80' }}>Recent Transactions</h4>
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              marginTop: '1rem',
            }}>
            {sub.subscriptionsToAddresses.length === 0 ? (
              <p style={{ color: '#aaa' }}>No transactions found.</p>
            ) : (
              sub.subscriptionsToAddresses.map((subAddr, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: '#252525',
                    borderLeft: '4px solid #ff9800',
                    position: 'relative',
                  }}>
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                    }}>
                    <span>
                      <strong>Address:</strong> {subAddr.address.address}{' '}
                    </span>
                    {subAddr.address.transactions.length > 0 && (
                      <span
                        style={{
                          backgroundColor: '#ff9800',
                          color: '#121212',
                          borderRadius: '5x',
                          padding: '2px 8px',
                          fontSize: '1rem',
                          lineHeight: '1rem',
                          fontWeight: 'bold',
                        }}>
                        {subAddr.address.transactions.length}
                      </span>
                    )}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Label:</strong>{' '}
                    {subAddr.address.label ?? 'No label'}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Value Condition:</strong>{' '}
                    {subAddr.valueCondition ?? 'Not set'}
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Status:</strong>{' '}
                    {subAddr.isActive ? (
                      <span style={{ color: '#4caf50' }}>Active</span>
                    ) : (
                      <span style={{ color: '#f44336' }}>Inactive</span>
                    )}
                  </p>

                  <div
                    style={{
                      marginTop: '1rem',
                      borderRadius: '6px',
                      transition: 'max-height 0.3s ease-out',
                    }}>
                    <h5 style={{ color: '#ffcc80', marginBottom: '0.5rem' }}>
                      Transactions:
                    </h5>
                    {subAddr.address.transactions.length > 0 ? (
                      <ul
                        style={{
                          padding: 0,
                          margin: 0,
                          listStyle: 'none',
                        }}>
                        {subAddr.address.transactions.map((tx, txIndex) => (
                          <li
                            key={txIndex}
                            style={{
                              marginBottom: '0.5rem',
                              padding: '1.5rem 1.5rem',
                              borderRadius: '4px',
                              background: '#444',
                            }}>
                            <p
                              style={{
                                textAlign: 'center',
                              }}>
                              <a
                                href={`https://etherscan.io/tx/${tx.hash}`}
                                target='_blank'
                                rel='noreferrer noopener'
                                style={{ color: '#ff9800' }}>
                                {tx.hash}
                              </a>
                            </p>
                            <p
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <strong>Amount:</strong> {tx.value} ETH
                            </p>
                            <p
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <strong>from:</strong>{' '}
                              {tx.from ?? 'Unknown address'}
                            </p>
                            <p
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              <strong>to:</strong> {tx.to ?? 'Unknown address'}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: '#aaa' }}>
                        No transactions available.
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </body>
    </html>
  );
};
