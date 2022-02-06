# MCO2: Transaction Management
### Trial 1
Three nodes are connected to the web page. Writing first tries to connect to Node 1 (central node), if it fails, it would determine if it should go to Node 2 or Node 3. Then, the changes would be logged to the log_table.

If a checker for a db connection says that a db is down, it would trigger a timed function that would keep checking if the db is already up.
