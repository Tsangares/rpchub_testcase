//Connect to HUB
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
var packageDefinition=protoLoader.loadSync("proto/hub.proto")
const definitions = grpc.loadPackageDefinition(packageDefinition)
const Hub=definitions.hub.rpc.Hub
var hub=new Hub("127.0.0.1:50051", grpc.credentials.createInsecure())

//Hub is now connect in the variable hub.
//Create the transfer function that takes in two users from iota hub, username and to.
//Username sends `amount` to the user `to`
function transfer(username,to,amount,callback){
    hub.GetDepositAddress({userId: username, includeChecksum: true},(err,res)=>{
	if (err){
	    console.log("FAILED TO GET BALANCE FOR THIS USER")
	    console.log(username)
	    console.log(err)
	}else{
	    hub.UserWithdraw({userId: username, payoutAddress: address, amount: amount, validateChecksum: true},(err,response)=>{
		if(err){
		    console.log("FAILED TO WITHDRAW")
		    console.log(username,address.length,amount)
		    console.log(err)
		}
		else{

		    callback(response.uuid)
		}
	    })

	}
    })
}


//This is the test scenario
addrs=['a','b','c','d','e','f','g','h','i','j']
var i = 0
var delay=0
var payer='th0br0'
addrs.forEach(addr=>{
    i += 1
    setTimeout(()=>{
	amount=10+Math.floor(Math.random()*140)
	console.log("Sending "+amount+" from "+payer.substring(0,5)+" to "+addr.substring(0,5))
	transfer(payer,addr,amount,uuid=>{
	    console.log(" => Reciept "+uuid)
	})

    }, delay*i)
})


