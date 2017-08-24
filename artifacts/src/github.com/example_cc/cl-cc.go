/*
Copyright IBM Corp. 2016 All Rights Reserved. Update By DELOITTE HK.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
		 http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// This chaincode implements a map that is stored in the state.
// The following operations are available.

// Invoke operations
// put - requires two arguments, a key and value
// remove - requires a key
// get - requires one argument, a key, and returns a value
// keys - requires no arguments, returns all keys

type SimpleChaincode struct {
}

// Chaincode data for mychannel1 (private channel)
type InsuranceApplication struct {
	//HKID              string `json:"hkid"`
	FullName          string `json:"fullname"`
	Sex               string `json:"sex"`
    	Address           string `json:"address"`
	HomePhone         string `json:"homephone"`
    	MobilePhone       string `json:"mobilephone"`
	ApplicationId     string `json:"applicationid"`
	PlanName          string `json:"planname"`
	SumAssured        string `json:"sumassured"`
	PolicyDate        string `json:"policydate"`
	PolicyCurrency    string `json:"policycurrency"`
        Email             string `json:"email"`
}

// Chaincode data for payment in mychannel
type ApplicationPayment struct {
	//ApplicationId     string `json:"applicationid"`
	TransactionId     string `json:"transactionid"`
	BankName	  string `json:"bankname"`
	PaymentAmount     string `json:"paymentamount"`
	PaymentDate       string `json:"paymentdate"`
	FullName          string `json:"fullname"`
	PolicyCurrency    string `json:"policycurrency"`
}

// Init is a no-op
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke has two functions
// put - takes two arguments, a key and value, and stores them in the state
// remove - takes one argument, a key, and removes if from the state
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	switch function {
	case "privateput":
		if len(args) < 11 {
			return shim.Error("put operation must include 11 arguments, a HKID and FullName, Sex, Address, HomePhone, MobilePhone, ApplicationId, PlanName, SumAssured, PolicyDate, PolicyCurrency")
		}
		HKID := args[0]
		FullName := args[1]
		Sex := args[2]
		Address := args[3]
		HomePhone := args[4]
		MobilePhone := args[5]
		ApplicationId := args[6]     
		PlanName := args[7]          
		SumAssured := args[8]        
		PolicyDate := args[9]       
		PolicyCurrency := args[10]
		Email := args[11]

		InsuranceApplication := &InsuranceApplication{FullName, Sex, Address, HomePhone, MobilePhone, ApplicationId, PlanName, SumAssured, PolicyDate, PolicyCurrency,Email}
		infoJSONasBytes, err := json.Marshal(InsuranceApplication)

		if err := stub.PutState(HKID, infoJSONasBytes); err != nil {
			fmt.Printf("Error putting state %s", err)
			return shim.Error(fmt.Sprintf("put operation failed. Error updating state: %s", err))
		}

		indexName := "compositeKeyTest"
		compositeKeyTestIndex, err := stub.CreateCompositeKey(indexName, []string{HKID})
		if err != nil {
			return shim.Error(err.Error())
		}

		valueByte := []byte{0x00}
		if err := stub.PutState(compositeKeyTestIndex, valueByte); err != nil {
			fmt.Printf("Error putting state with compositeKey %s", err)
			return shim.Error(fmt.Sprintf("put operation failed. Error updating state with compositeKey: %s", err))
		}

		return shim.Success(nil)

	case "paymentput":
		if len(args) < 7 {
			return shim.Error("put operation must include 7 arguments, an ApplicationId and TransactionId, BankName, PaymentAmount, PaymentDate,FullName,PolicyCurrency")
		}
		ApplicationId := args[0]
		TransactionId := args[1]
		BankName := args[2]     
		PaymentAmount := args[3]
		PaymentDate := args[4]
		FullName  := args[5]
		PolicyCurrency := args[6]

		ApplicationPayment := &ApplicationPayment{TransactionId, BankName, PaymentAmount, PaymentDate,FullName,PolicyCurrency}
		infoJSONasBytes, err := json.Marshal(ApplicationPayment)

		if err := stub.PutState(ApplicationId, infoJSONasBytes); err != nil {
			fmt.Printf("Error putting state %s", err)
			return shim.Error(fmt.Sprintf("put operation failed. Error updating state: %s", err))
		}

		indexName := "compositeKeyTest"
		compositeKeyTestIndex, err := stub.CreateCompositeKey(indexName, []string{ApplicationId})
		if err != nil {
			return shim.Error(err.Error())
		}

		valueByte := []byte{0x00}
		if err := stub.PutState(compositeKeyTestIndex, valueByte); err != nil {
			fmt.Printf("Error putting state with compositeKey %s", err)
			return shim.Error(fmt.Sprintf("put operation failed. Error updating state with compositeKey: %s", err))
		}

		return shim.Success(nil)

	case "remove":
		if len(args) < 1 {
			return shim.Error("remove operation must include one argument, a key")
		}
		key := args[0]

		err := stub.DelState(key)
		if err != nil {
			return shim.Error(fmt.Sprintf("remove operation failed. Error updating state: %s", err))
		}
		return shim.Success(nil)

	case "get":
		if len(args) < 1 {
			return shim.Error("get operation must include one argument, a key")
		}
		key := args[0]
		value, err := stub.GetState(key)
		if err != nil {
			return shim.Error(fmt.Sprintf("get operation failed. Error accessing state: %s", err))
		}
		return shim.Success(value)

	case "keys":
		if len(args) < 2 {
			return shim.Error("put operation must include two arguments, a key and value")
		}
		startKey := args[0]
		endKey := args[1]

		//sleep needed to test peer's timeout behavior when using iterators
		stime := 0
		if len(args) > 2 {
			stime, _ = strconv.Atoi(args[2])
		}

		keysIter, err := stub.GetStateByRange(startKey, endKey)
		if err != nil {
			return shim.Error(fmt.Sprintf("keys operation failed. Error accessing state: %s", err))
		}
		defer keysIter.Close()

		var keys []string
		for keysIter.HasNext() {
			//if sleeptime is specied, take a nap
			if stime > 0 {
				time.Sleep(time.Duration(stime) * time.Millisecond)
			}

			response, iterErr := keysIter.Next()
			if iterErr != nil {
				return shim.Error(fmt.Sprintf("keys operation failed. Error accessing state: %s", err))
			}
			keys = append(keys, response.Key)
		}

		for key, value := range keys {
			fmt.Printf("key %d contains %s\n", key, value)
		}

		jsonKeys, err := json.Marshal(keys)
		if err != nil {
			return shim.Error(fmt.Sprintf("keys operation failed. Error marshaling JSON: %s", err))
		}

		return shim.Success(jsonKeys)

	case "history":
		key := args[0]
		keysIter, err := stub.GetHistoryForKey(key)
		if err != nil {
			return shim.Error(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
		}
		defer keysIter.Close()

		var keys []string
		for keysIter.HasNext() {
			response, iterErr := keysIter.Next()
			if iterErr != nil {
				return shim.Error(fmt.Sprintf("query operation failed. Error accessing state: %s", err))
			}
			keys = append(keys, response.TxId)
		}

		for key, txID := range keys {
			fmt.Printf("key %d contains %s\n", key, txID)
		}

		jsonKeys, err := json.Marshal(keys)
		if err != nil {
			return shim.Error(fmt.Sprintf("query operation failed. Error marshaling JSON: %s", err))
		}

		return shim.Success(jsonKeys)

	default:
		return shim.Success([]byte("Unsupported operation"))
	}
}

func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
