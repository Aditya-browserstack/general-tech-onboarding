This is a Log watching solution.

Implementation :-

1) index.html : Here, I have imported the socket.io script from the official documentation and kept the "logFile" as the key
for data retreival.

2) index.js : Here, I have firstly created a server and transformed it to a websocket for multiple client inclusion.
              During the first connection, **initialFileLoad** method is called which prints the last 10 lines of the file
              Now, for monitoring the file changes, I have used fs module's watchFile method that checks for any changes and if 
              any changes are found, **readNewLines** method is called which prints the new lines that have been added.

**NOTE** : I am not reading the file as a whole, instead reading it line by line to prevent heavy memory usage and reducing load
           I have used offsets to keep track of the lastReadPosition of that particular file.


