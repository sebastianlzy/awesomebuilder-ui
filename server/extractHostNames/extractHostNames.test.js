const extractHostNames = require('./extractHostNames');
const hostnames = require('./hostnames-output.json')

test('server/extractHostNames.js: extract host names', () => {
    expect(extractHostNames(hostnames)).toEqual(["ip-10-192-20-172.ap-southeast-1.compute.internal"])
});


