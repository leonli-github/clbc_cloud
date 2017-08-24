## ChinaLife Blockchain

A sample Node.js app to demonstrate **__fabric-client__** & **__fabric-ca-client__** Node.js SDK APIs

### Prerequisites and setup:

* [Docker](https://www.docker.com/products/overview) - v1.12 or higher
* [Docker Compose](https://docs.docker.com/compose/overview/) - v1.8 or higher
* [Git client](https://git-scm.com/downloads) - needed for clone commands
* **Node.js** v6.9.0 - 6.10.0 ( __Node v7+ is not supported__ )
* Download docker images

```
cd clbc_2.0

docker-compose -f artifacts/docker-compose.yaml pull
```

Once you have completed the above setup, you will have provisioned a local network with the following docker container configuration:

* 2 CAs
* A SOLO orderer
* 4 peers (2 peers per Org)

#### Artifacts

* Crypto material has been generated using the **cryptogen** tool from Hyperledger Fabric and mounted to all peers, the orderering node and CA containers. More details regarding the cryptogen tool are available [here](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html#crypto-generator).
* An Orderer genesis block (genesis.block) and channel configuration transaction (mychannel.tx) has been pre generated using the **configtxgen** tool from Hyperledger Fabric and placed within the artifacts folder. More details regarding the configtxgen tool are available [here](http://hyperledger-fabric.readthedocs.io/en/latest/build_network.html#configuration-transaction-generator).

## Running the sample program

There are two steps available for running the chinaLife Blockchain sample

##### Terminal Window 1

```
cd clbc_2.0

./runApp.sh
```

* This lauches the required network on your local machine
* Installs the fabric-client and fabric-ca-client node modules
* And, starts the node app on PORT 4000

##### Terminal Window 2

In order for the following shell script to properly parse the JSON, you must install ``jq``:

instructions [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/)

With the application started in terminal 1, next, test the APIs by executing the script - **testAPIs.sh**:

```
cd clbc_2.0

./testAPIs.sh
```

## Blockchain REST APIs Requests

### Login Request

Register and enroll new users in Organization - **Org1**:

```
curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=ChinaLife&orgName=org1'
```

**OUTPUT:**

```
{
  "success": true,
  "secret": "xZfsrQbSBXgu",
  "message": "ChinaLife enrolled Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M"
}
```

The response contains the success/failure status, an **enrollment Secret** and a **JSON Web Token (JWT)** that is a required string in the Request Headers for subsequent requests.

### Create Channel request

```
curl -s -X POST \
  http://localhost:4000/channels \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"channelName":"mychannel",
	"channelConfigPath":"../artifacts/channel/mychannel.tx"
}'
```

**OUTPUT:**

```
{
  "success": true,
  "message":"Channel 'mychannel' created Successfully"
}
```

Please note that the Header **authorization** must contain the JWT returned from the `POST /users` call

### Join Channel request

```
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["localhost:7051","localhost:7056"]
}'
```

**OUTPUT:**

```
{
  "success": true,
  "message":"Successfully joined peers in organization org1 to the channel 'mychannel'"
}
```

### Install chaincode

```
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["localhost:7051","localhost:7056"],
	"chaincodeName":"cl-cc",
	"chaincodePath":"github.com/example_cc",
	"chaincodeVersion":"v0"
}'
```

**OUTPUT:**

```
Successfully Installed chaincode on organization org1
```

### Instantiate chaincode

```
curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"chaincodeName":"cl-cc",
	"chaincodeVersion":"v0",
	"functionName":"init",
	"args":["init"]
}'
```

**OUTPUT:**

```
Chaincode Instantiation is SUCCESS
```

### Invoke Payment request

```
curl -s -X POST \
  http://localhost:4000/insertpayment/channels/mychannel/chaincodes/mycc/ \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["localhost:7051"],
	"args": ["ApplicationId","TransactionId","BankName","PaymentAmount","PaymentDate","FullName","PolicyCurrency"]
}'
```

**OUTPUT:**

```
Transacton ID is 6f047933529a4ed2f0749efa0c8c46026337e9f1a2704c02fdcf8b4a892004d8
```

**NOTE:** Ensure that you save the Transaction ID from the response in order to pass this string in the subsequent query transactions.

### Invoke KYC request

```
curl -s -X POST \
  http://localhost:4000/insertkyc/channels/mychannel/chaincodes/mycc \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json" \
  -d '{
	"peers": ["localhost:7051"],
	"args": ["HKID", "FullName", "Sex", "Address", "HomePhone", "MobilePhone", "ApplicationId", "PlanName", "SumAssured", "PolicyDate", "PolicyCurrency", "Email"]
}'
```

### Chaincode Payment Query

```
curl -s -X GET \
  "http://localhost:4000/querypayment/channels/mychannel/chaincodes/mycc?peer=peer1&args=%5B%22ApplicationId%22%5D" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"transactionid":"TransactionId","bankname":"BankName","paymentamount":"PaymentAmount","paymentdate":"PaymentDate","fullname":"FullName","policycurrency":"PolicyCurrency"}
```

### Chaincode KYC Query

```
curl -s -X GET \
  "http://localhost:4000/querykyc/channels/mychannel/chaincodes/mycc?peer=peer1&args=%5B%22HKID%22%5D" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"fullname":"FullName", "sex":"Sex", "address":"Address", "homephone":"HomePhone", "mobilephone":"MobilePhone", "applicationId":"ApplicationId", "planname":"PlanName", "sumassured":"SumAssured", "policydate":"PolicyDate", "policycurrency":"PolicyCurrency", "email":"Email"}
```

### Query Block by BlockNumber

```
curl -s -X GET \
  "http://localhost:4000/channels/mychannel/blocks/1?peer=peer1" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"header":{"number":{"low":1,"high":0,"unsigned":true},"previous_hash":"d76fce7c618036d58bcb0323af81f9b147b13835c7ea3252dd0285c2054138d1","data_hash":"d48855e4de585975fff33458324bb5a153e2fa5fc0211e5d6ea8b5b26c7fb704"},"data":{"data":[{"signature":{"type":"Buffer","data":[48,68,2,32,44,235,220,254,140,233,203,71,189,171,158,215,7,56,90,104,212,1,135,21,119,53,218,207,76,46,175,143,223,130,148,214,2,32,14,110,218,198,129,13,205,63,125,169,82,61,33,248,61,196,157,226,27,165,73,40,201,149,246,190,233,229,134,6,235,105]},"payload":{"header":{"channel_header":{"type":"ENDORSER_TRANSACTION","version":3,"timestamp":"Wed Jul 05 2017 15:44:46 GMT+0800 (HKT)","channel_id":"mychannel","tx_id":"7a7c6e2e55ec6c335c40a76e104a25f9b5b94754c38cdd22a65f6acb41d960ba","epoch":0,"extension":{"type":"Buffer","data":[18,6,18,4,108,115,99,99]}},"signature_header":{"creator":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN CERTIFICATE-----\nMIICGTCCAb+gAwIBAgIQKKKdQSzsDoUYn/LPAuRWGTAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTla\nMFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMR8wHQYDVQQDDBZBZG1pbkBvcmcxLmV4YW1wbGUuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECmbzUDozIrLKjp3OAzItSG7m7Flw76rT\n8VO8E6otlCwxKtBRkPpZL7norC3NsjyE339J5O4pXCqhIApQyRRsRqNNMEswDgYD\nVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDnKSJOiz8xeE\nyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwIDSAAwRQIhALT02pc/\nyfE/4wUJfUBQ32GifUEh8JktAXzL/73S0rjYAiACNSp6zAQBX9SBxTOGMk4cGGAy\nCKqf8052NVUs2CvPzA==\n-----END CERTIFICATE-----\n"},"nonce":{"type":"Buffer","data":[14,175,249,42,158,53,135,65,152,60,244,174,103,100,86,130,31,131,237,182,122,183,12,148]}}},"data":{"actions":[{"header":{"creator":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN CERTIFICATE-----\nMIICGTCCAb+gAwIBAgIQKKKdQSzsDoUYn/LPAuRWGTAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTla\nMFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMR8wHQYDVQQDDBZBZG1pbkBvcmcxLmV4YW1wbGUuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAECmbzUDozIrLKjp3OAzItSG7m7Flw76rT\n8VO8E6otlCwxKtBRkPpZL7norC3NsjyE339J5O4pXCqhIApQyRRsRqNNMEswDgYD\nVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDnKSJOiz8xeE\nyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwIDSAAwRQIhALT02pc/\nyfE/4wUJfUBQ32GifUEh8JktAXzL/73S0rjYAiACNSp6zAQBX9SBxTOGMk4cGGAy\nCKqf8052NVUs2CvPzA==\n-----END CERTIFICATE-----\n"},"nonce":{"type":"Buffer","data":[14,175,249,42,158,53,135,65,152,60,244,174,103,100,86,130,31,131,237,182,122,183,12,148]}},"payload":{"chaincode_proposal_payload":{"input":{"type":"Buffer","data":[10,126,8,1,18,6,18,4,108,115,99,99,26,114,10,6,100,101,112,108,111,121,10,9,109,121,99,104,97,110,110,101,108,10,31,10,29,8,1,18,11,18,5,99,108,45,99,99,26,2,118,48,26,12,10,4,105,110,105,116,10,4,105,110,105,116,10,60,18,16,18,14,8,1,18,2,8,0,18,2,8,1,18,2,8,2,26,14,18,12,10,10,79,114,100,101,114,101,114,77,83,80,26,11,18,9,10,7,79,114,103,49,77,83,80,26,11,18,9,10,7,79,114,103,50,77,83,80]}},"action":{"proposal_response_payload":{"proposal_hash":"b09d39dcab897372a34bffb3b438642a88c575b3fa8faf8c8efb7e022bef4d21","extension":{"results":{"data_model":0,"ns_rwset":[{"namespace":"lscc","rwset":{"reads":[{"key":"cl-cc","version":null}],"range_queries_info":[],"writes":[{"key":"cl-cc","is_delete":false,"value":"\n\u0005cl-cc\u0012\u0002v0\u001a\u0004escc\"\u0004vscc*<\u0012\u0010\u0012\u000e\b\u0001\u0012\u0002\b\u0000\u0012\u0002\b\u0001\u0012\u0002\b\u0002\u001a\u000e\u0012\f\n\nOrdererMSP\u001a\u000b\u0012\t\n\u0007Org1MSP\u001a\u000b\u0012\t\n\u0007Org2MSP2D\n @\u00144\u001c���5?�Nnjf���V\u001e~�\u0016,S��\u001eU��\u0012�\u0012 B��Rei���\u0003xnc����/�hcZ�r6\u0004fA\r�.�: �Ι��d�F�V�\u001f\u001f�\u0006\riz5]J�L�\u001d�\u0010̂��B,\u0012\f\u0012\n\b\u0001\u0012\u0002\b\u0000\u0012\u0002\b\u0001\u001a\r\u0012\u000b\n\u0007Org1MSP\u0010\u0001\u001a\r\u0012\u000b\n\u0007Org2MSP\u0010\u0001"}]}}]},"events":{"chaincode_id":"","tx_id":"","event_name":"","payload":{"type":"Buffer","data":[]}},"response":{"status":200,"message":"","payload":"\n\u0005cl-cc\u0012\u0002v0\u001a\u0004escc\"\u0004vscc*<\u0012\u0010\u0012\u000e\b\u0001\u0012\u0002\b\u0000\u0012\u0002\b\u0001\u0012\u0002\b\u0002\u001a\u000e\u0012\f\n\nOrdererMSP\u001a\u000b\u0012\t\n\u0007Org1MSP\u001a\u000b\u0012\t\n\u0007Org2MSP2D\n @\u00144\u001c���5?�Nnjf���V\u001e~�\u0016,S��\u001eU��\u0012�\u0012 B��Rei���\u0003xnc����/�hcZ�r6\u0004fA\r�.�: �Ι��d�F�V�\u001f\u001f�\u0006\riz5]J�L�\u001d�\u0010̂��B,\u0012\f\u0012\n\b\u0001\u0012\u0002\b\u0000\u0012\u0002\b\u0001\u001a\r\u0012\u000b\n\u0007Org1MSP\u0010\u0001\u001a\r\u0012\u000b\n\u0007Org2MSP\u0010\u0001"}}},"endorsements":[{"endorser":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN -----\nMIICGDCCAb+gAwIBAgIQPcMFFEB/vq6mEL6vXV7aUTAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTla\nMFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMR8wHQYDVQQDExZwZWVyMC5vcmcxLmV4YW1wbGUuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEzS9k2gCKHcat8Wj4T2nB1uyC8R2zg3um\nxdTL7nmgFWp0uyCCbQQxD/VS+8R/3DNvEFkvzhcjc9NU/nRqMirpLqNNMEswDgYD\nVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDnKSJOiz8xeE\nyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwIDRwAwRAIgHBdxbHUG\nrFUzKPX9UmmN3SwigWcRUREUy/GTb3hDIAsCIEF1BxTqv8ilQYE8ql0wJL4mTber\nHE6DFYvvBCUnicUh\n-----END -----\n"},"signature":{"type":"Buffer","data":[48,69,2,33,0,197,58,34,65,105,2,151,32,81,12,70,251,62,32,17,16,118,58,246,55,24,96,221,37,224,134,214,4,166,127,223,229,2,32,123,227,168,104,58,107,97,48,55,24,56,178,44,221,202,159,39,181,169,255,14,56,127,199,240,231,9,115,77,26,116,228]}},{"endorser":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN -----\nMIICGjCCAcCgAwIBAgIRAI+BBtEBvpOqhfRZZH7eV/YwCgYIKoZIzj0EAwIwczEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcwNjIzMTIzMzE5WhcNMjcwNjIxMTIzMzE5\nWjBbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMN\nU2FuIEZyYW5jaXNjbzEfMB0GA1UEAxMWcGVlcjEub3JnMS5leGFtcGxlLmNvbTBZ\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCnT04ltvjsgiZVuCGLsRYzEiCTJZlZw\nh3HT/273B3NkWA7wrlyK7FfAanIyexuR1UI9m4+YKNqFG6cgYnf8MsejTTBLMA4G\nA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIA5ykiTos/MX\nhMipPFuO9vTByR2ebld8RcMxY2Cf5AARMAoGCCqGSM49BAMCA0gAMEUCIQCSRdWm\ni4IgVUajvzWVxyE/wi7n617pVqS4+nJ7gbTRjQIgefzBwS+bkNhPc3/rktySFLRC\nWMnq87KyqMLc6iRaJx0=\n-----END -----\n"},"signature":{"type":"Buffer","data":[48,68,2,32,88,116,0,185,76,229,197,94,71,161,109,13,163,177,24,40,197,5,96,134,186,2,109,170,243,254,61,193,181,182,158,32,2,32,112,109,50,180,65,12,155,3,196,211,162,86,65,75,3,234,76,236,20,63,105,51,93,207,254,0,93,118,91,142,180,228]}}]}}}]}}}]},"metadata":{"metadata":[{"value":"","signatures":[{"signature_header":{"creator":{"Mspid":"OrdererMSP","IdBytes":"-----BEGIN -----\nMIICDTCCAbOgAwIBAgIRALFafJiTFN/47AvAGfvj1ZEwCgYIKoZIzj0EAwIwaTEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xFDASBgNVBAoTC2V4YW1wbGUuY29tMRcwFQYDVQQDEw5jYS5leGFt\ncGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTlaMFgxCzAJBgNV\nBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNp\nc2NvMRwwGgYDVQQDExNvcmRlcmVyLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYI\nKoZIzj0DAQcDQgAEYtguLKFBLLc0VSwyPHHHNe76HH71oOXK6wun8Y/5vtMawPZ/\nWTm/vBVUWdfNlzc9eA28aXx6zBAB8iRm16EeU6NNMEswDgYDVR0PAQH/BAQDAgeA\nMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDUbM8OlDbBvDtuK/gM2yAsSUNgT5\nXHLuD/g50+wwBxkwCgYIKoZIzj0EAwIDSAAwRQIhANJuEGHBftrtlWgie9zgc60J\n/XVytPN/D0rPlkMV17n7AiBBbStggGBfFYcQ2LhDhcKut8nScJ2OFrt+dJSdJbod\n7A==\n-----END -----\n"},"nonce":{"type":"Buffer","data":[255,196,13,37,42,154,89,247,134,220,206,99,218,214,5,84,216,246,229,240,96,74,240,138]}},"signature":{"type":"Buffer","data":[48,68,2,32,53,163,115,150,12,160,245,117,85,187,168,45,110,60,80,61,233,195,57,0,250,85,158,138,30,216,248,140,172,218,43,74,2,32,116,225,249,186,126,84,196,213,224,101,203,151,40,233,251,212,117,78,157,176,20,185,38,240,80,20,224,162,175,158,63,75]}}]},{"value":{"index":{"low":0,"high":0,"unsigned":true}},"signatures":[{"signature_header":{"creator":{"Mspid":"OrdererMSP","IdBytes":"-----BEGIN -----\nMIICDTCCAbOgAwIBAgIRALFafJiTFN/47AvAGfvj1ZEwCgYIKoZIzj0EAwIwaTEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xFDASBgNVBAoTC2V4YW1wbGUuY29tMRcwFQYDVQQDEw5jYS5leGFt\ncGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTlaMFgxCzAJBgNV\nBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNp\nc2NvMRwwGgYDVQQDExNvcmRlcmVyLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYI\nKoZIzj0DAQcDQgAEYtguLKFBLLc0VSwyPHHHNe76HH71oOXK6wun8Y/5vtMawPZ/\nWTm/vBVUWdfNlzc9eA28aXx6zBAB8iRm16EeU6NNMEswDgYDVR0PAQH/BAQDAgeA\nMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDUbM8OlDbBvDtuK/gM2yAsSUNgT5\nXHLuD/g50+wwBxkwCgYIKoZIzj0EAwIDSAAwRQIhANJuEGHBftrtlWgie9zgc60J\n/XVytPN/D0rPlkMV17n7AiBBbStggGBfFYcQ2LhDhcKut8nScJ2OFrt+dJSdJbod\n7A==\n-----END -----\n"},"nonce":{"type":"Buffer","data":[120,217,253,160,235,213,158,87,248,2,28,23,32,76,10,246,9,130,144,197,210,107,215,202]}},"signature":{"type":"Buffer","data":[48,68,2,32,47,149,85,127,143,33,131,88,11,188,244,106,35,124,74,31,234,26,118,53,204,255,76,52,82,98,176,30,177,216,175,102,2,32,101,114,190,242,87,133,246,31,161,24,56,7,98,153,247,7,183,94,229,134,90,32,58,73,168,89,116,237,27,112,15,100]}}]},[]]}}
```

### Query Transaction by TransactionID

```
curl -s -X GET http://localhost:4000/channels/mychannel/transactions/TRX_ID?peer=peer1 \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"validationCode":0,"transactionEnvelope":{"signature":{"type":"Buffer","data":[48,69,2,33,0,157,124,110,237,106,43,53,21,228,167,50,242,25,31,233,43,148,85,133,103,192,45,117,205,95,70,231,138,234,90,19,59,2,32,95,250,172,156,53,46,141,120,215,181,84,37,125,27,160,204,117,248,74,186,224,158,153,186,148,46,199,92,128,138,141,83]},"payload":{"header":{"channel_header":{"type":"ENDORSER_TRANSACTION","version":3,"timestamp":"Wed Jul 05 2017 15:45:27 GMT+0800 (HKT)","channel_id":"mychannel","tx_id":"6f047933529a4ed2f0749efa0c8c46026337e9f1a2704c02fdcf8b4a892004d8","epoch":0,"extension":{"type":"Buffer","data":[18,7,18,5,99,108,45,99,99]}},"signature_header":{"creator":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN CERTIFICATE-----\nMIIB9TCCAZugAwIBAgIUChb4eK0iQZAusrQwBqrcm1mUYTUwCgYIKoZIzj0EAwIw\nczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\nE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcwNzA1MDc0MDAwWhcNMTgwNzA1MDc0\nMDAwWjAUMRIwEAYDVQQDEwlDaGluYUxpZmUwWTATBgcqhkjOPQIBBggqhkjOPQMB\nBwNCAAR0rX3FfIdfeNb1xZYgBHETowT6pnrUaM9bz6RzgLalL+8JAn7EjqPbz82D\nEcxRTtsiYWhdYiSitBD5OhjjLQajo2wwajAOBgNVHQ8BAf8EBAMCAgQwDAYDVR0T\nAQH/BAIwADAdBgNVHQ4EFgQUv8O4PcSMiTvKQFZni++8iIeiJzswKwYDVR0jBCQw\nIoAgDnKSJOiz8xeEyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwID\nSAAwRQIhAP4ofAZLCciDshrGmpsPfcxvyx6cS8VkEL0pYXbDQcRSAiBkZGwyc+Fd\nRjwmHiBIMtP9e1bfU5vleBJ3R7sE2MRAvg==\n-----END CERTIFICATE-----\n"},"nonce":{"type":"Buffer","data":[179,107,180,144,55,197,118,30,235,59,220,231,83,81,165,52,143,26,164,186,80,47,19,196]}}},"data":{"actions":[{"header":{"creator":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN CERTIFICATE-----\nMIIB9TCCAZugAwIBAgIUChb4eK0iQZAusrQwBqrcm1mUYTUwCgYIKoZIzj0EAwIw\nczELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\nE2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTcwNzA1MDc0MDAwWhcNMTgwNzA1MDc0\nMDAwWjAUMRIwEAYDVQQDEwlDaGluYUxpZmUwWTATBgcqhkjOPQIBBggqhkjOPQMB\nBwNCAAR0rX3FfIdfeNb1xZYgBHETowT6pnrUaM9bz6RzgLalL+8JAn7EjqPbz82D\nEcxRTtsiYWhdYiSitBD5OhjjLQajo2wwajAOBgNVHQ8BAf8EBAMCAgQwDAYDVR0T\nAQH/BAIwADAdBgNVHQ4EFgQUv8O4PcSMiTvKQFZni++8iIeiJzswKwYDVR0jBCQw\nIoAgDnKSJOiz8xeEyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwID\nSAAwRQIhAP4ofAZLCciDshrGmpsPfcxvyx6cS8VkEL0pYXbDQcRSAiBkZGwyc+Fd\nRjwmHiBIMtP9e1bfU5vleBJ3R7sE2MRAvg==\n-----END CERTIFICATE-----\n"},"nonce":{"type":"Buffer","data":[179,107,180,144,55,197,118,30,235,59,220,231,83,81,165,52,143,26,164,186,80,47,19,196]}},"payload":{"chaincode_proposal_payload":{"input":{"type":"Buffer","data":[10,119,8,1,18,7,18,5,99,108,45,99,99,26,106,10,10,112,97,121,109,101,110,116,112,117,116,10,13,65,112,112,108,105,99,97,116,105,111,110,73,100,10,13,84,114,97,110,115,97,99,116,105,111,110,73,100,10,8,66,97,110,107,78,97,109,101,10,13,80,97,121,109,101,110,116,65,109,111,117,110,116,10,11,80,97,121,109,101,110,116,68,97,116,101,10,8,70,117,108,108,78,97,109,101,10,14,80,111,108,105,99,121,67,117,114,114,101,110,99,121]}},"action":{"proposal_response_payload":{"proposal_hash":"2a5a1b8e7aa490c3aaf8ea14920b5e1b1800fe6b4062370fe85ce04010e4b799","extension":{"results":{"data_model":0,"ns_rwset":[{"namespace":"cl-cc","rwset":{"reads":[],"range_queries_info":[],"writes":[{"key":"\u0000compositeKeyTest\u0000ApplicationId\u0000","is_delete":false,"value":"\u0000"},{"key":"ApplicationId","is_delete":false,"value":"{\"transactionid\":\"TransactionId\",\"bankname\":\"BankName\",\"paymentamount\":\"PaymentAmount\",\"paymentdate\":\"PaymentDate\",\"fullname\":\"FullName\",\"policycurrency\":\"PolicyCurrency\"}"}]}},{"namespace":"lscc","rwset":{"reads":[{"key":"cl-cc","version":{"block_num":{"low":1,"high":0,"unsigned":true},"tx_num":{"low":0,"high":0,"unsigned":true}}}],"range_queries_info":[],"writes":[]}}]},"events":{"chaincode_id":"","tx_id":"","event_name":"","payload":{"type":"Buffer","data":[]}},"response":{"status":200,"message":"","payload":""}}},"endorsements":[{"endorser":{"Mspid":"Org1MSP","IdBytes":"-----BEGIN -----\nMIICGDCCAb+gAwIBAgIQPcMFFEB/vq6mEL6vXV7aUTAKBggqhkjOPQQDAjBzMQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu\nb3JnMS5leGFtcGxlLmNvbTAeFw0xNzA2MjMxMjMzMTlaFw0yNzA2MjExMjMzMTla\nMFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T\nYW4gRnJhbmNpc2NvMR8wHQYDVQQDExZwZWVyMC5vcmcxLmV4YW1wbGUuY29tMFkw\nEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEzS9k2gCKHcat8Wj4T2nB1uyC8R2zg3um\nxdTL7nmgFWp0uyCCbQQxD/VS+8R/3DNvEFkvzhcjc9NU/nRqMirpLqNNMEswDgYD\nVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgDnKSJOiz8xeE\nyKk8W4729MHJHZ5uV3xFwzFjYJ/kABEwCgYIKoZIzj0EAwIDRwAwRAIgHBdxbHUG\nrFUzKPX9UmmN3SwigWcRUREUy/GTb3hDIAsCIEF1BxTqv8ilQYE8ql0wJL4mTber\nHE6DFYvvBCUnicUh\n-----END -----\n"},"signature":{"type":"Buffer","data":[48,69,2,33,0,147,155,172,243,2,172,199,163,58,32,111,154,32,62,75,147,132,34,233,105,147,113,54,138,239,190,182,118,67,254,183,166,2,32,46,50,254,111,67,79,99,97,43,22,96,70,7,87,122,216,179,62,160,76,139,172,186,135,214,117,195,153,92,213,127,12]}},{"endorser":{"Mspid":"Org2MSP","IdBytes":"-----BEGIN -----\nMIICGjCCAcCgAwIBAgIRANDlqX1daKI2aN0Qm7vrfKAwCgYIKoZIzj0EAwIwczEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xGTAXBgNVBAoTEG9yZzIuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzIuZXhhbXBsZS5jb20wHhcNMTcwNjIzMTIzMzE5WhcNMjcwNjIxMTIzMzE5\nWjBbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMN\nU2FuIEZyYW5jaXNjbzEfMB0GA1UEAxMWcGVlcjAub3JnMi5leGFtcGxlLmNvbTBZ\nMBMGByqGSM49AgEGCCqGSM49AwEHA0IABP8N39LBcB0qJyb3v9Y9WIPfYHOfWPna\nT8WyWzGisrYvHVF+GLfDLFrjQs0uN8QPsTsqYlnXDs/Mjv7tZaE9NuqjTTBLMA4G\nA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIKfUfvpGproH\ncwyFD+0sE3XfJzYNcif0jNwvgOUFZ4AFMAoGCCqGSM49BAMCA0gAMEUCIQDa1gKe\nPRVRN/i8hUptACw02V7V9Yeo7kKlbQ6vWU5fqAIgXg2xAQ4TjwXOHlKbIyYZ7fox\ncekBJ+E8yAFm8XQrfy0=\n-----END -----\n"},"signature":{"type":"Buffer","data":[48,69,2,33,0,238,102,233,214,128,143,80,14,200,49,203,171,211,0,12,3,242,124,14,94,156,166,47,35,181,120,25,121,243,203,249,251,2,32,109,139,233,8,148,123,57,166,131,39,225,106,25,213,220,185,80,163,138,54,45,112,128,174,159,62,43,118,203,92,181,110]}}]}}}]}}}}
```

**NOTE**: Here the TRX_ID can be from any previous invoke transaction

### Query ChainInfo

```
curl -s -X GET \
  "http://localhost:4000/channels/mychannel?peer=peer1" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"height":{"low":3,"high":0,"unsigned":true},"currentBlockHash":{"buffer":{"type":"Buffer","data":[8,3,18,32,210,63,234,168,180,117,251,217,189,147,235,134,83,166,118,88,251,128,180,44,29,199,47,139,229,104,44,144,221,46,69,52,26,32,240,155,76,74,251,173,239,104,245,68,177,240,24,216,183,97,129,114,125,48,172,203,157,70,104,185,129,75,68,162,153,80]},"offset":4,"markedOffset":-1,"limit":36,"littleEndian":true,"noAssert":false},"previousBlockHash":{"buffer":{"type":"Buffer","data":[8,3,18,32,210,63,234,168,180,117,251,217,189,147,235,134,83,166,118,88,251,128,180,44,29,199,47,139,229,104,44,144,221,46,69,52,26,32,240,155,76,74,251,173,239,104,245,68,177,240,24,216,183,97,129,114,125,48,172,203,157,70,104,185,129,75,68,162,153,80]},"offset":38,"markedOffset":-1,"limit":70,"littleEndian":true,"noAssert":false}}
```

### Query Installed chaincodes

```
curl -s -X GET \
  "http://localhost:4000/chaincodes?peer=peer1&type=installed" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
["name: cl-cc, version: v0, path: github.com/example_cc"]
```

### Query Instantiated chaincodes

```
curl -s -X GET \
  "http://localhost:4000/chaincodes?peer=peer1&type=instantiated" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
["name: cl-cc, version: v0, path: github.com/example_cc"]
```

### Query Channels

```
curl -s -X GET \
  "http://localhost:4000/channels?peer=peer1" \
  -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTkyNzY2NzgsInVzZXJuYW1lIjoiQ2hpbmFMaWZlIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTkyNDA2Nzh9.6IzZRwjkT04VCo7pbxOgV0-dtp06dNAI4x1nqGsj64M" \
  -H "content-type: application/json"
```

**OUTPUT:**

```
{"channels":[{"channel_id":"mychannel"}]}
```

## User Management REST APIs Requests

### Show Admin UI

View, Insert, Update, Delete User Records

```
curl -s -X GET http://localhost:4000/
```

### Sign Up User

```
curl -s -X POST http://localhost:4000/signup/UserName/UserEmail/UserPassword
```

### Login User

```
curl -d "email=UserEmail&password=UserPassword" -s -X POST http://localhost:4000/loginuser
```

### Query User Record

```
curl -s -X GET http://localhost:4000/fetchdata?id=595c74ef2d259b624b0e7c5c
```

**OUTPUT:**

```
[{"_id":"595c74ef2d259b624b0e7c5c","username":"chinalife","email":"BT+2cmWCGZ/I8fkWZruCVGXmfP2mM5Z0Ct3/2aR3vnM=","password":"eT0C2Vd9v4S6H4HqYGQx5Q=="}]
```

### Edit User Record

```
curl -d "id=595c74ef2d259b624b0e7c5c&username=chinalife&email=BT+2cmWCGZ/I8fkWZruCVGXmfP2mM5Z0Ct3/2aR3vnM=&password=NewPassword" -s -X POST http://localhost:4000/edit
```

### Delete User Record

```
curl -s -X GET http://localhost:4000/delete?id=595c74ef2d259b624b0e7c5c
```

### Network configuration considerations

You have the ability to change configuration parameters by editing the network-config.json file.

#### IP Address and PORT information

If you choose to customize your docker-compose yaml file by hardcoding IP Addresses and PORT information for your peers and orderer, then you MUST also add the identical values into the network-config.json file. The paths shown below will need to be adjusted to match your docker-compose yaml file.

```
		"orderer": {
			"url": "grpcs://x.x.x.x:7050",
			"server-hostname": "orderer0",
			"tls_cacerts": "../artifacts/tls/orderer/ca-cert.pem"
		},
		"org1": {
			"ca": "http://x.x.x.x:7054",
			"peer1": {
				"requests": "grpcs://x.x.x.x:7051",
				"events": "grpcs://x.x.x.x:7053",
				...
			},
			"peer2": {
				"requests": "grpcs://x.x.x.x:7056",
				"events": "grpcs://x.x.x.x:7058",
				...
			}
		},
		"org2": {
			"ca": "http://x.x.x.x:8054",
			"peer1": {
				"requests": "grpcs://x.x.x.x:8051",
				"events": "grpcs://x.x.x.x:8053",
				...			
			},
			"peer2": {
				"requests": "grpcs://x.x.x.x:8056",
				"events": "grpcs://x.x.x.x:8058",
				...
			}
		}
```

#### Discover IP Address

To retrieve the IP Address for one of your network entities, issue the following command:

```
# this will return the IP Address for peer0
docker inspect peer0.org1.example.com | grep IPAddress
```

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>. Updated By <a rel="update" href="https://www2.deloitte.com/cn/en/misc/litetopicpage.global-topic-tags.hong-kong.html#">Deloitte HK</a>.
