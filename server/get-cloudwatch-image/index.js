const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
// Create CloudWatch service object
const cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
const metricsJson = require('./eks-metrics.json')

const getCloudWatchImage = (req, res) => {
    cw.getMetricWidgetImage({MetricWidget: JSON.stringify(metricsJson), "OutputFormat": "png"}, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            res.send({image: data["MetricWidgetImage"].toString('base64')})
        }
    });

}

module.exports = getCloudWatchImage