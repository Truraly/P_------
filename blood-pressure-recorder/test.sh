# GET /index.html
loadtest http://localhost:1300/index.html -c 10 -n 10000 -m GET
# POST /records
loadtest  http://localhost:1300/records  -c 10 -n 10000  -m POST -T "application/json" \
-P "{\"high\":156,\"low\":99,\"heartRate\":67,\"remark\":\"ullaute\",\"location\":\"右手\"}"
# GET /records/after/:timestamp
loadtest http://localhost:1300/records/after/1620000000000 -c 10 -n 10000 -m GET
# GET /records/latest/:count
loadtest http://localhost:1300/records/latest/10 -c 10 -n 10000 -m GET
# PUT /records/:timestamp
loadtest  http://localhost:1300/records/1713305292533  -c 10 -n 10000  -m PUT \
-T "application/json" \
-P "{\"high\":156,\"low\":99,\"heartRate\":67,\"remark\":\"ullaute\",\"location\":\"右手\"}"
# DELETE /records/:id
loadtest  http://localhost:1300/records/1713305292533  -c 10 -n 10000  -m DELETE