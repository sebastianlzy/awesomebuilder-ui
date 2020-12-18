const express = require('express');
const bodyParser = require('body-parser');
const get = require('lodash/get')
const AWS = require('aws-sdk');
const got = require('got');
const extractHostNames = require('./extractHostNames/extractHostNames')

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

AWS.config.update({region: 'ap-southeast-1'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const secretsmanager = new AWS.SecretsManager();
const mysql = require('mysql');

// Create CloudWatch service object
var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});



const getDBConnectionParams = async () => {
    const params = {
        SecretId: "MyRDSInstanceRotationSecret-E8RVFHtdPBvC",
        VersionStage: "AWSCURRENT"
    };

    return new Promise((resolve, reject) => {

        secretsmanager.getSecretValue(params, function (err, data) {
            if (err) {
                reject(err)
                return
            }
            const secret = JSON.parse(get(data, "SecretString", {}))
            resolve({
                    host: get(secret, 'host'),
                    user: get(secret, 'username'),
                    password: get(secret, 'password'),
                }
            )
        });
    })
}

let pool = undefined

if (pool === undefined) {
    getDBConnectionParams()
        .then((connectionParams) => {
            pool = mysql.createPool({
                connectionLimit: 10,
                database: 'awesomebuilder',
                ...connectionParams
            });
        })
        .catch((err) => console.log("getDBConnectionParams:", err))
}

const getHostname = async () => {
    try {
        const response = await got(
            'http://169.254.169.254/latest/meta-data/hostname',
            {timeout: 500}
        );
        return response.body
    } catch (error) {
        return error.response.body;
    }
}

const getHostNames = async () => {
    return new Promise((resolve, reject) => {
        ec2.describeInstances({
            DryRun: false
        }, function (err, data) {
            if (err) {
                console.log("GetHostNameError", err)
                reject(err.stack)
            } else {
                resolve(extractHostNames(data))
            }
        });
    })
}

app.get('/api/get-instance-hostname', (req, res) => {
    const insertHostName = async (hostname) => {
        console.log(`[${req.headers.referer}] get-instance-hostname: `, hostname)
        return new Promise((resolve, reject) => {
            pool.query(`INSERT into hostname(name) values("${hostname}") `, function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
        })
    }

    return getHostname()
        .then((hostname) => {
            return insertHostName(hostname)
                .then(() => res.send({hostname: hostname}))
                .catch(() => res.send({hostname: hostname}))
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
    const getHostNames = async () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * from hostname order by created_at DESC limit 10 ', function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
        })
    }

    return getHostNames().then((hostnames) => {
        res.send({hostnames: hostnames});
    }).catch(() => {
        res.send({hostnames: ['ip-10-192-20-128.ap-southeast-1.compute.internal', '2']})
    })
});

app.get('/api/cloudwatch-asg-image', (req, res) => {
    const params = {
        "metrics": [
            [ "AWS/AutoScaling", "GroupTotalCapacity", "AutoScalingGroupName", "Webserver-WebServerGroup-1VX7RIGT4NI3D", { "yAxis": "left", "label": "Number of running instances [${LAST}]" } ],
            [ ".", "GroupInServiceInstances", ".", ".", { "yAxis": "left", "label": "Number of instances in service [${LAST}]" } ],
            [ "AWS/EC2", "CPUUtilization", ".", ".", { "stat": "p99", "yAxis": "left", "label": "ASG CPUUtilization [${LAST}]" } ]
        ],
        "view": "timeSeries",
        "stacked": false,
        "setPeriodToTimeRange": true,
        "liveData": true,
        "annotations": {
            "horizontal": [
                {
                    "label": "CPU utilization threshold",
                    "value": 10
                }
            ]
        },
        "yAxis": {
            "left": {
                "showUnits": true
            },
            "right": {
                "label": "Number of instances",
                "showUnits": true
            }
        },
        "stat": "Maximum",
        "period": 30,
        "legend": {
            "position": "right"
        },
        "width": 1654,
        "height": 250,
        "start": "-PT30M",
        "end": "P0D",
        "timezone": "+0800"
    }

    cw.getMetricWidgetImage({MetricWidget: JSON.stringify(params), "OutputFormat": "png"}, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {

            res.send({image: data["MetricWidgetImage"].toString('base64')})
        }
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    app.close(() => {
        debug('HTTP server closed')
    })
    pool.end()
})
