const extractHostNames = require('./index');
const hostnames = require('./hostnames-output.json')

test('server/extract-host-names/index.js: extract host names', () => {
    expect(extractHostNames(hostnames)).toEqual(["ip-10-192-20-172.ap-southeast-1.compute.internal"])
});


