# MCO2: Transaction Management
This project is a website that simulates transaction management in distributed database systems that support concurrent multi-user access, which is used as a major course output for a database systems class. 

## Project Files
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

## Setting up
### How to set up and run the project locally through a NodeJS Server:
1. Extract the folder from the zipped file that you can download through this DownGit [link](https://minhaskamal.github.io/DownGit/#/home?url=https://github.com/francheska-vicente/stadvdb-mco2).
3. Naviate to the project folder (using the cd command) 
(i.e. the main folder containing the file app.js)
4. Run the command in order to install all the modules needed in order to run the project successfully:
```
npm install 
```
5. We may now run the server by typing ```node app.js```
6. Since the web application is running on localhost:3000, type ```http://localhost:3000``` on your browser of choice.
7. Now, you would be able to see and use the application!

### Online
The deployed web application can be access through [link](http://mco2-imdb-movies.herokuapp.com/).

## Authors
- **Sophia Louisse L. Eguaras**
- **Andrea Jean Marcelo**
- **Francheska Josefa Vicente**
- **Sophia Danielle S. Vista**
