const express = require('express');
const router = express.Router();
const { sql, poolMain, poolClient } = require('../db');
const { generateKey, generateHashKey, generateHashCode } = require('../utils/hashUtils');

router.post('/generate', async (req, res) => {
  const { ClientName, StartDate, EndDate, CIN } = req.body;
  const ProductKey = generateKey();
  const today = new Date().toISOString().split('T')[0];
  const HashKey = generateHashKey(today, ProductKey);
  const HashCode = generateHashCode(ProductKey, HashKey);

  try {
    const [mainTx, clientTx] = [new sql.Transaction(poolMain), new sql.Transaction(poolClient)];
    await Promise.all([mainTx.begin(), clientTx.begin()]);

    await Promise.all([
      new sql.Request(mainTx).query`
        INSERT INTO Clients (ClientName, StartDate, EndDate, CIN, ProductKey, LastHashKey, LastHashCode, LastPing, FailedDays, IsLocked)
        VALUES (${ClientName}, ${StartDate}, ${EndDate}, ${CIN || null}, ${ProductKey}, ${HashKey}, ${HashCode}, ${today}, 0, 0)
      `,
      new sql.Request(clientTx).query`
        INSERT INTO Clients (ClientName, StartDate, EndDate, CIN, ProductKey)
        VALUES (${ClientName}, ${StartDate}, ${EndDate}, ${CIN || null}, ${ProductKey})
      `
    ]);

    await Promise.all([mainTx.commit(), clientTx.commit()]);
    res.json({ message: '✅ Client registered in both DBs', ProductKey, HashKey, HashCode });
  } catch (err) {
    console.error(err);
    const [mainTx, clientTx] = [new sql.Transaction(poolMain), new sql.Transaction(poolClient)];
    await Promise.all([mainTx.rollback(), clientTx.rollback()]);
    res.status(500).json({ error: '❌ Failed to register client in both DBs' });
  }
});

const checkAndLockInactiveClients = async () => {
  try {
    const result = await poolMain.request().query`
      UPDATE Clients
      SET IsLocked = 1
      WHERE LastPingDate < DATEADD(DAY, -2, GETDATE())
        AND IsLocked = 0
    `;
    console.log(`Locked ${result.rowsAffected[0]} inactive clients`);
  } catch (err) {
    console.error('Error locking inactive clients:', err);
  }
};

// Schedule the check every 24 hours
setInterval(checkAndLockInactiveClients, 24 * 60 * 60 * 1000);

router.post('/validate', async (req, res) => {
  const { productKey, hashKey, hashCode, date } = req.body;
  const today = date || new Date().toISOString().split('T')[0];

  try {
    const result = await poolMain.request().query`SELECT * FROM Clients WHERE ProductKey = ${productKey}`;
    const client = result.recordset[0];
    
    // Update last ping date for successful validation
    if (client && !client.IsLocked) {
      await poolMain.request().query`
        UPDATE Clients
        SET LastPingDate = GETDATE()
        WHERE ProductKey = ${productKey}
      `;
    }
    if (!client) return res.status(404).json({ error: 'Client not found' });
    if (client.IsLocked) return res.status(403).json({ error: 'Client is locked' });

    const dateToHash = new Date(today) <= new Date(client.EndDate) ? today : client.EndDate;
    const expectedHashKey = generateHashKey(dateToHash, productKey);
    const expectedHashCode = generateHashCode(productKey, expectedHashKey);

    if (hashKey === expectedHashKey && hashCode === expectedHashCode) {
      await poolMain.request().query`
        UPDATE Clients SET LastPing = ${today}, FailedDays = 0, LastHashKey = ${hashKey}, LastHashCode = ${hashCode} WHERE ProductKey = ${productKey}
      `;
      return res.json({ message: '✅ Access granted' });
    }

    const failedDays = client.FailedDays + 1;
    const lock = failedDays >= 2;
    await poolMain.request().query`
      UPDATE Clients SET FailedDays = ${failedDays}, IsLocked = ${lock} WHERE ProductKey = ${productKey}
    `;
    return res.status(401).json({ message: lock ? '🔒 Access locked after 2 failures' : '❌ Invalid hash' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Validation failed' });
  }
});

router.post('/unlock', async (req, res) => {
  const { productKey } = req.body;
  if (!productKey) return res.status(400).json({ error: 'Product key is required' });

  try {
    const result = await poolMain.request().query`
      UPDATE Clients SET IsLocked = 0, FailedDays = 0 WHERE ProductKey = ${productKey}
    `;
    res.json(result.rowsAffected[0] > 0 ? { message: '✅ Client account has been unlocked.' } : { error: 'Product key not found.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '❌ Failed to unlock client account.' });
  }
});

module.exports = router;
