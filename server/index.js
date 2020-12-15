const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});

const got = require('got');

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

app.get('/api/get-instance-hostname', (req, res) => {
    return getHostname().then((hostname) => {
        res.send({hostname: `Hello From ${hostname}`});
    }).catch(() => {
        res.send({hostname: 'Did not send through'})
    })
});

app.listen(port, () => console.log(`Listening on port ${port}`));