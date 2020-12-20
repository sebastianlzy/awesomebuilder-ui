# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Build status
[![Build Status](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/buildStatus/icon?job=awesomebuilder-node&subject=Build)](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/job/awesomebuilder-node/)
[![Build Status](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/buildStatus/icon?job=awesomebuilder-pipeline&subject=Deployment)](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/job/awesomebuilder-pipeline)

![Traffic](./readme/traffic.PNG)

## Objective

### Why?
It is often difficult to visualize and understand how elasticity works in AWS. 

### How will this demo help?
This demo aims to showcase how an application is able to cope with spiky traffic by increasing the number of compute instances based on CPU utilization 

### What is included in the demo?

#### Web UI

The Web UI consist of 3 sections: 
1. [Web UI - Cloudfront](https://d36du6tgphs6li.cloudfront.net/)
2. [Web UI - ALB](http://webse-appli-wvdu5rb0sit7-1557819975.ap-southeast-1.elb.amazonaws.com/)

##### 1. No. of running instances
This section provides an overview of the number of running instances. 
Instance serving the request is highlighted in "Green" while instances that are "running" are displayed in "Grey"

##### 2. Cloudwatch metrics
This section provides the
 
1. Overall CPU utilization of the Auto-Scaling Group (ASG) instances, 
2. Total number of "running" instances
3. Total number of instance in service that are able to respond to request 

##### 3. Recorded hostnames
This section provides a historical list of instance metadata that has served a request 

#### How to get started?

##### Generating traffic

Each task will opens 100 connections and send 5000 request every 10 seconds for 4 mins

![Traffic](./readme/generate-load.gif)

##### What to expect?

Due to load generation, group CPU utilization will increase over the threshold of 10%. Auto scaling group will be triggered to add additional resources. Once provision, the instance will need pass health check for the next 20 seconds before being added to the application load balancer. 


![Load](./readme/scaling-instances.gif)

---



#### Infrastructure

We use [Cloudformation](https://github.com/sebastianlzy/awesomebuilder-infra) to provision our infrastructure

---

#### Continuous integration/Continuous Deployment

Existing [Jenkins server](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/) and [Ansible script](https://github.com/sebastianlzy/awesomebuilder-ansible) can be repurposed to deploy application to AWS 

---
