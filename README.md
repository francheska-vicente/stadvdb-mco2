# MCO2: Transaction Management

## Nodes 
#### Node 1
This node is the central node that holds all of the movies in the database. This is where the writing occurs.
#### Node 2 and Node 3
These two nodes are follower nodes, which is mostly used for reading in the database. In the case that Node 1 is unavailable, updates would be pushed here.

## Writing Process
#### Update: 
Before this process would be started, the program would check a "checker" ("WRITING", "READING", or "NONE") in the table if there is a transaction that is currently using a specific entry. If the checker is currently "WRITING," no other transaction can happen. If it is only "READING," reading transactions can happen.

Before putting the changes in the log, the checker for that entry must be turned into "WRITING."
#### 1. Changes would be put in the log in the node that the changes would happen.
Each of the instances/nodes would have one table that would act as the logger. The logger would include the timestamp wherein the changes happening on that node would be written. This would allow the web application to "redo" all of these changes to the other nodes.
#### 2. Changes would be reflected on the current writing node.
"Current writing node" refers to Node 1 if it is up and updated. If it is down, the current writing node would be Node 2 and Node 3, which means that we would first have to check the year to know where we would need to change it.
#### 3a. If the follower node is available, every few seconds, the changes in the log would be reflected to this node.
#### 3b. If the follower node is avaiable after being unavailable, the changes would be reflected from the log. 
However, we still cannot use this node for reading/writing until it is finish updating.
#### 4. Update the checker to "NONE."

## Things to Note
1. It is possible to change the movie year, which means that we might have to move a movie from Node 2 to Node 3.
2. A checker might need to be added to the database to determine if there is a transaction writing to it. This would avoid concurrency problems that might occur when a transaction reads it while it is being updated.
3. Since the ID used in the DB is auto-incrementing, it might include issues wherein an ID used by Node 2 and Node 3 might refer to different movies.
