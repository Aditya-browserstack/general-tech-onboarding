Bash assignment :-


Part 1 :- Printing the longest request:

grep 'Completed': Filters the lines with "Completed"
sort -nk7: Sorts the lines based on the 7th word i.e. the time taken
tail -1: Prints the last one since we have sorted in ascending, last one will the request taking maximum time.


Part 2 :- Printing the frequency of the unique endpoints:

grep 'Started': Filters the lines with "Started".
cut -d' ' -f3: Extracts the 3rd field i.e. the endpoint.
cut -d'?' -f1: Removes query parameters.
sort: Sorts endpoints.
uniq -c: Counts occurrences of unique endpoints.
awk '{print $2,$1}': Rearranges the output to display the endpoint first and count later.




**NOTE**: To run this :- "bash script.sh"