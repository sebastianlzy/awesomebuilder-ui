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
The web UI consist of 3 sections

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

##### What to expect?


##### Appendix
1. [Web UI](http://webse-appli-wvdu5rb0sit7-1557819975.ap-southeast-1.elb.amazonaws.com/)

---




### What is needed for this demo?

#### Infrastructure

##### Appendix
1. [cloudformation template](https://github.com/sebastianlzy/awesomebuilder-infra)

---

#### Application deployment/Code Integration



##### Appendix
1. [Ansible](https://github.com/sebastianlzy/awesomebuilder-ansible)
1. [Jenkins server](http://ec2-3-1-6-16.ap-southeast-1.compute.amazonaws.com/) 

---

#### Content Delivery Network

---

#### Security

##### Security group

##### Secret manager

 


## Screenshots

![screenshot](./readme/awesomebuilder-ui.gif)



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

