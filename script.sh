echo ""
echo "The request that took the longest time is :"
grep 'Completed' ./tmp_more_than_50 | sort -nk7 | tr -d '"' | tail -1

echo ""
echo "The list of requests with their frequency are :"
grep 'Started' ./tmp_more_than_50 | cut -d' ' -f3 | cut -d'?' -f1 | tr -d '"'| sort | uniq -c | awk '{print $2,$1}'

