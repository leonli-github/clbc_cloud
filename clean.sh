
#Clean up docker containers
docker rm -f $(docker ps -aq)

#Clean cc dockerimages
docker rmi -f $(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')


#Cleanup the material
rm -rf /tmp/hfc-test-kvs_peerOrg* $HOME/.hfc-key-store/ /tmp/fabric-client-kvs_peerOrg* 

