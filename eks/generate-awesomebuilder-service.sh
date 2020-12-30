sed s/%IMAGE_PATH%/public.ecr.aws\\/m8o2b2o2\\/awesomebuilder:$(git rev-parse HEAD)/g \
./eks/awesomebuilder-service.dev.yaml > ./eks/awesomebuilder-service.temp.yaml
sed -e s/%COMMIT_MESSAGE%/$(printf "%q" $(git log -1 --pretty=%B))/g ./eks/awesomebuilder-service.temp.yaml > ./eks/awesomebuilder-service.yaml
rm  ./eks/awesomebuilder-service.temp.yaml