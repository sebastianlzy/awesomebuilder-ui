

![Traffic](./readme/traffic.PNG)

## Objective

### Why?
It is often difficult to visualize and understand how elasticity works in EKS. 

### How will this demo help?
This demo aims to showcase how an application is able to cope with spiky traffic by 

1. increasing the number of pod 
2. increasing the number of nodes 

### What is included in the demo?

#### Web UI

The Web UI consist of 3 sections: 
2. [Web UI - ALB](http://k8s-default-awesomeb-c423295acd-be9479a82d3a0b69.elb.ap-southeast-1.amazonaws.com/)

##### 1. No. of running instances
This section provides an overview of the number of running nodes. 
Instance serving the request is highlighted in "Green" while instances that are "running" are displayed in "Grey"

##### 2. Cloudwatch metrics
This section provides the
 
1. Overall CPU utilization of the Auto-Scaling Group (ASG) instances, 
2. Total number of healthy pods behind a NLB

##### 3. Recorded hostnames
This section provides a historical list of instance metadata that has served a request 

#### How to get started?

##### Generating traffic

Each task will opens 100 connections and send 5000 request every 10 seconds for 4 mins

##### What to expect?

Due to load generation, group CPU utilization will increase over the threshold of 10%. Auto scaling group will be triggered to add additional resources. Once provision, the instance will need pass health check for the next 20 seconds before being added to the application load balancer. 

---

### Infrastructure

![EKS](https://raw.githubusercontent.com/sebastianlzy/draw-io/master/awesomebuilder/awesomebuilderIII-EKS.png)

---

### Continuous integration/Continuous Deployment

```
# To deploy latest commit change
npr deploy
``` 

---

### Estimated Total Cost of Ownership (TCO)


#### Assumptions
1. Operates mainly out of Asia Pacific (Singapore)
2. Workload is a small web application that uses resources in equal proportion
3. 	Most of the traffic happens between 0800 - 2200 (10 hours), with uncertain and unpredictable usage pattern
4. A total of 10,000 users, with an average of 1 requests per second
5. Each request last an average of 1 second and transfer around 300KB of data
6. An estimated usage of 1TB of object storage usage
7. Compute resources needed
	1. 	2 baseline instances - minimum needed for non-peak user traffic
	2. 4 peak instances - maximum needed to handle spike
8. Usage of Multi AZ for High availability

 

#### Service breakdown (TBA)


#### References
1. https://media.amazonwebservices.com/AWS_TCO_Web_Applications.pdf

