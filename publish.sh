echo 'building container'
alscli docker build-container awesomebuilder-ui .
echo 'docker image built'
alscli docker list-images

echo 'tagging container'
alscli ecr tag-container awesomebuilder-ui public.ecr.aws/m8o2b2o2/awesomebuilder
echo 'container tagged'
alscli docker list-images

echo 'get credential'
alscli ecr login-with-docker public.ecr.aws/m8o2b2o2
echo 'credential obtained'

echo 'pushing container'
alscli ecr push-container public.ecr.aws/m8o2b2o2/awesomebuilder
echo 'container pushed'

echo 'update deployment file'
. ./eks/generate-awesomebuilder-service.sh

echo 'update pod deployment'
alscli eks apply ./eks/awesomebuilder-service.yaml

echo 'wait for pod deployment'
alscli eks rollout-status deployment.apps/awesomebuilder-app