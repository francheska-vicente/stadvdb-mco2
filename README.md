# MCO2: Transaction Management

### Nodes 
#### Node 1
This node is the central node that holds all of the movies in the database. This is where the writing occurs.
### Node 2 and Node 3
These two nodes are follower nodes, which is mostly used for reading in the database. In the case that Node 1 is unavailable, updates would be pushed here.

### Writing Process
#### 1. Changes would be put in the log in the node that the changes would happen.
Each of the instances/nodes would have one table that would act as the logger. The logger would include the timestamp wherein the changes happening on that node would be written. This would allow the web application to "redo" all of these changes to the other nodes.
#### 2. Changes would be reflected on the current writing node.
"Current writing node" refers to Node 1 if it is up and updated. If it is down, the current writing node would be Node 2 and Node 3, which means that we would first have to check the year to know where we would need to change it.
#### 3. 
