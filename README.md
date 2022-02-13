# MCO2: Transaction Management
This project is a website that simulates transaction management in distributed database systems that support concurrent multi-user access, which is used as a major course output for a database systems class. 

The deployed web application can be access through http://mco2-imdb-movies.herokuapp.com/.

# Project Stucture
### Models
Execution of functions were done asynchronously with promises.
| Model Files                                 | Description                                                 |
|---------------------------------------------|-------------------------------------------------------------|
| [`db.js`](models/db.js)                     | Handles query concurrency (supposedly) and failover         |
| [`nodes.js`](models/nodes.js)               | Connects to nodes, executes queries for specific nodes      |
| [`transaction.js`](models/transaction.js)   | Starts transactions                                         |
| [`logs.js`](models/logs.js)                 | Connects to log table, retrieves and updates log table rows |
| [`sync.js`](models/sync.js)                 | Iterates through unreplicated rows and updates nodes        |
| [`replicator.js`](models/replicator.js)     | Handles when data replication occurs                        |
