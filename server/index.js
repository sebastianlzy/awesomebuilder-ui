const express = require('express');
const bodyParser = require('body-parser');
const get = require('lodash/get')
const AWS = require('aws-sdk');
const got = require('got');

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

AWS.config.update({region: 'ap-southeast-1'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});



const getHostname = async () => {
    try {
        const response = await got(
            'http://169.254.169.254/latest/meta-data/hostname',
            {timeout: 500}
        );
        return response.body
    } catch (error) {
        console.log(error)
        return error.response.body;
    }
}

const extractHostNames = (data) => {
    const reservations = get(data, 'Reservations', [])
    return reservations.reduce((hostnames, reservation) => {
        if (get(reservation, 'Instances.0.State.Name') !== "running") {
            return hostnames
        }

        if (get(reservation, 'Instances.0.ImageId') !== "ami-0ae5ba72ac157d468") {
            return hostnames
        }

        hostnames.push(get(reservation, 'Instances.0.PrivateDnsName'))
        return hostnames
    }, [])

}

const getHostNames = async () => {
    return new Promise((resolve, reject) => {
        ec2.describeInstances({
            DryRun: false
        }, function(err, data) {
            console.log("error", err)
            if (err) {
                reject(err.stack)
            } else {
                console.log("Success", JSON.stringify(data));
                resolve(extractHostNames(data))
            }
        });
    })
}

app.get('/api/get-instance-hostname', (req, res) => {
    return getHostname().then((hostname) => {
        res.send({hostname: hostname});
    }).catch(() => {
        res.send({hostname: 'ip-10-192-20-128.ap-southeast-1.compute.internal'})
    })
});

app.get('/api/get-all-instance-hostnames', (req, res) => {
    return getHostNames().then((hostnames) => {
        res.send({hostnames: hostnames});
    }).catch(() => {
        res.send({hostnames: ['ip-10-192-20-128.ap-southeast-1.compute.internal', '2']})
    })
});

app.get('/api/get-previous-instance-hostnames', (req, res) => {
    return Promise.resolve([{
        hostname: 'ip-10-192-20-128.ap-southeast-1.compute.internal',
        created_at: '10-12-2020 10:59'
    }]).then((hostnames) => {
        res.send({hostnames: hostnames});
    }).catch(() => {
        res.send({hostnames: ['ip-10-192-20-128.ap-southeast-1.compute.internal', '2']})
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`));