require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const get = require('lodash/get')
const AWS = require('aws-sdk');
const got = require('got');
const path = require("path");
const extractHostNames = require('./extract-host-names')
const getCloudWatchImage = require('./get-cloudwatch-image')

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

AWS.config.update({region: 'ap-southeast-1'});
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
const secretsmanager = new AWS.SecretsManager();
const mysql = require('mysql');


const getDBConnectionParams = async () => {
    const params = {
        SecretId: process.env.RDS_SECRET_ID,
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

app.use(express.static(path.join(__dirname, "../build")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.get('/api/get-pod-metadata', (req, res) => {
    return res.send({
        podName: process.env.POD_NAME || "mypodname",
        podIPAddress: process.env.POD_IP || "mypodipaddress"
    })
})

app.get('/api/get-instance-hostname', (req, res) => {
    const insertHostName = async (hostname) => {
        console.log(`[${req.headers.referer}][${hostname}] : /api/get-instance-hostname `, )
        return new Promise((resolve, reject) => {
            pool.query(`INSERT into hostname(name, podname, podip) values("${hostname}", "${process.env.POD_NAME}", "${process.env.POD_IP}") `, function (error, results, fields) {
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
                if (error) reject([]);
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

app.get('/api/cloudwatch-metrics-image', getCloudWatchImage)

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    app.close(() => {
        debug('HTTP server closed')
    })
    pool.end()
})
