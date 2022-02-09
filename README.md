# MCO2: Transaction Management: Pia Edition

### Models
Execution of functions were done asynchronously with promises.
| Model Files      | Description                                                 |
|------------------|-------------------------------------------------------------|
| `db.js`          | Handles query concurrency (supposedly) and failover         |
| `nodes.js`       | Connects to nodes, executes queries for specific nodes      |
| `transaction.js` | Starts transactions                                         |
| `logs.js`        | Connects to log table, retrieves and updates log table rows |
| `sync.js`        | Iterates through unreplicated rows and updates nodes        |
| `replicator.js`  | Handles when data replication occurs                        |
