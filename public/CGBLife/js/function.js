$(".btn").click(function(e) {
    var url = "/loginuser"; // the script where you handle the form input.
    let email = $('#form-email').val();
    let password = $('#form-password').val();
    $.ajax({
        type: "POST",
        url: url,
        data: {
            email:encrypt(email),
            password:encrypt(password)
        },
        success: function(data)
        {
            if(data==false) {
                alert("登錄失敗");
            }else {
		$.ajax({
        		type: "POST",
        		async: false,
        		contentType: "application/x-www-form-urlencoded",
        		url: "/users",
        		data: "username=cgb&orgName=org2",
        		success: function(data) {
                		window.location.href = "main.html";
                		console.log(data);
				$.cookie("cgb_token", data.token);
			}
		});
            }
        }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
});
var KYC = null;
var HKID = null;
function GenerateTR(data,withBtn){
    Clear();
    var template;
    if(withBtn){
        template = "<tr id='sec'><td id='content'>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td><img class='next' src='images/next.png' style='visibility:visible;width:60%;cursor:pointer' onClick='javascript:part2();'></img></td></tr>";
    }else{
        template = "<tr id='sec'><td id='content'>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td></td></tr>";
    }
    var obj = data;
    if (data.transactionid == null) {
        template = template.replace("{0}",document.getElementById("searchTerm1").value);
        template = template.replace("{1}","");
        template = template.replace("{2}","");
        template = template.replace("{3}","");
        template = template.replace("{4}","");
        template = template.replace("{5}","");
        template = template.replace("{6}","");
    }
    else {
        template = template.replace("{0}",document.getElementById("searchTerm1").value);
        template = template.replace("{1}",decrypt(obj["fullname"]));
        template = template.replace("{2}",decrypt(obj["transactionid"]));
        template = template.replace("{3}",decrypt(obj["bankname"]));
        template = template.replace("{4}",decrypt(obj["policycurrency"]));
        template = template.replace("{5}",decrypt(obj["paymentamount"]));
        template = template.replace("{6}",decrypt(obj["paymentdate"]));
    }
    $('#accounttable').append(template);
}
function NoResult(){
    var template = "<tr id='sec'><td id='content'>{0}</td><td id='nocontent'>{1}</td><td></td><td></td><td></td><td></td><td></td></tr>";
    template = template.replace("{0}",document.getElementById("searchTerm1").value);
    template = template.replace("{1}","未有支付记录");
    if( $("td#content").length){
        $("td#content").parent().replaceWith(template);
    }
    else{
        $('#accounttable').append(template);
    }
}
function part1() {
    document.getElementById("part1").style.visibility = "visible";
    $("#journey1").attr("style","visibility: visible;width:100%");
}
function part2() {
    document.getElementById("part2").style.visibility = "visible";
    document.getElementById("part1").style.visibility = "hidden";
    $("#journey2").attr("src","images/Journey2@2x.jpg");
    $("#journey2").attr("style","visibility: visible;width:100%");
    $(".content").css("min-height","1300px");
    $("#fullname").val(decrypt(KYC.fullname));
    $("#sex").val(decrypt(KYC.sex));
    $("#id").val(HKID);
    $("#email").val(decrypt(KYC.email));
    $("#address").val(decrypt(KYC.address));
    $("#residential").val(decrypt(KYC.homephone));
    $("#mobile").val(decrypt(KYC.mobilephone));
    $("#amount").val(decrypt(KYC.sumassured));
    $("#applicationid").val(decrypt(KYC.applicationid));
    $("#currency").val(decrypt(KYC.policycurrency));
}
function part6() {
    document.getElementById("part6").style.visibility = "visible";
    document.getElementById("part0").style.visibility = "hidden";
    document.getElementById("part1").style.visibility = "hidden";
    document.getElementById("part2").style.visibility = "hidden";
    $("#journey1").attr("style","visibility: visible;width:100%");
}
function part4() {
    document.getElementById("part4").style.visibility = "visible";
    document.getElementById("part1").style.visibility = "hidden";
    document.getElementById("part2").style.visibility = "hidden";
    document.getElementById("part6").style.visibility = "hidden";
    var product = $("#select_policy").val();
    var productcode = $("#select_policy option:selected").text();
    var premium = null;
    switch(product) {
        case "policy1":
            premium = "100,000";
            break;
        case "policy2":
            premium = "120,000";
            break;
        case "policy3":
            premium = "220,000";
            break;
        case "policy4":
            premium = "150,000";
            break;
        case "policy5":
            premium = "80,000";
            break;
    }
    $("#productnum2").val(productcode);
    $("#amount2").val(premium);
    $("#applicationid2").val((Math.floor(Date.now() / 1000)).toString());
}
function part5() {
    $("#journey1").attr("src","images/Journey1_Complete@2x.jpg");
    $("#journey2").attr("src","images/Journey2@2x.jpg");
    $("#journey2").attr("style","visibility: visible;width:100%");
    document.getElementById("part5").style.visibility = "visible";
    document.getElementById("part1").style.visibility = "hidden";
    document.getElementById("part4").style.visibility = "hidden";
    document.getElementById("part2").style.visibility = "hidden";
    window.scrollTo(0, 0);
}
function GetClientinfoByHKID(HKID){
    var clientinfo = null;
    $.ajax({
    	type: "GET",
    	async: false,
    	contentType: "application/json",
    	url: "/querykyc/channels/mychannel/chaincodes/cl-cc?peer=peer1&args=%5B%22"+encodeURIComponent(HKID)+"%22%5D",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cgb_token")
    	},
    	success: function(data) {
    		if(data.length!=0){
    			clientinfo = JSON.parse(data);
    		}
    	}
    });
    KYC = clientinfo;
    return clientinfo;
}
function GetPaymentinfoByApplicationID(ApplicationID){
    var paymentinfo = null;
    $.ajax({
    	type: "GET",
    	async: false,
    	contentType: "application/json",
    	url: "/querypayment/channels/mychannel/chaincodes/cl-cc?peer=peer1&args=%5B%22"+encodeURIComponent(ApplicationID)+"%22%5D",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cgb_token")
    	},
    	success: function(data) {
    		if(data.length!=0){
    			paymentinfo = JSON.parse(data);
    		}
    	}
    });
    return paymentinfo;
}
function SearchByHKID() {
    HKID = $('#searchTerm1').val();
    if(HKID !=null) {
        var clientinfo = GetClientinfoByHKID(encrypt(HKID));
        if(clientinfo != null){
            paymentinfo = GetPaymentinfoByApplicationID(clientinfo.applicationid);
            if(paymentinfo === null) {
                GenerateTR(clientinfo,true);
                $("#journey1").attr("src","images/Journey1_Complete@2x.jpg");             
            } else {
                GenerateTR(paymentinfo,false);
                $("#journey1").attr("src","images/Journey1_Complete@2x.jpg");
            }
        }
        else { Clear(); }
    }
}
function encrypt(plaintext){
    var key = "0123456789abcdef";
    var iv = "0123456789abcdef";
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(plaintext,key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    encrypted = encrypted.toString();
    return encrypted;
}
function decrypt(encrypted){
    var key = "0123456789abcdef";
    var iv = "0123456789abcdef";
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted,key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    return decrypted ;
}
function Clear() {
    if( $("td#content").length){
        $("td#content").parent().remove();
    }
}
function Pay(){
    var e_applicationid = encrypt( $("#applicationid").val());
    var e_trascid = encrypt((Math.floor(Date.now() / 1000)).toString());
    var e_bname = encrypt("广发银行");
    var e_amount = encrypt( $("#amount").val());
    var e_pdate = encrypt(Date().toString());
    var e_fullname = encrypt($("#fullname").val());
    var e_currency = encrypt($("#currency").val());
    $("#journey2").attr("src","images/Journey2_Complete@2x.jpg");
    document.getElementById("part3").style.visibility = "visible";
    document.getElementById("part2").style.visibility = "hidden";
    $.ajax({
    	type: "POST",
    	async: false,
    	contentType: "application/json",
    	url: "/insertpayment/channels/mychannel/chaincodes/cl-cc",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cgb_token")
    	},
    	beforeSend: function() {
    		window.scrollTo(0, 0);
    		document.getElementById("div_gif").style.visibility = "visible";
    		$('#gif').attr('src', 'images/webview.gif');
    	},
    	data: JSON.stringify ({
    		"args": [e_applicationid,e_trascid,e_bname,e_amount,e_pdate,e_fullname,e_currency],
    		"peers": ["localhost:8051"],
    	}),
    	success: function(data) {
    		$("#journey3").attr("src","images/Journey3_Complete@2x.jpg");
    		$("#journey3").attr("style","visibility: visible;width:100%");
    		document.getElementById("div_gif").style.visibility = "hidden";
    		document.getElementById("done").style.visibility = "visible";
    	}
    });
    NotifyInsurance($("#applicationid").val());
}
function Pay2(){
    var e_applicationid = encrypt( $("#applicationid2").val());
    var e_trascid = encrypt((Math.floor(Date.now() / 1000)).toString());
    var e_bname = encrypt("广发银行");
    var e_amount = encrypt( $("#amount2").val());
    var e_pdate = encrypt(Date().toString());
    var e_fullname = encrypt($("#fullname2").val());
    var e_currency = encrypt($("#currency2").val());
    $("#journey2").attr("src","images/Journey2_Complete@2x.jpg");
    document.getElementById("part3").style.visibility = "visible";
    document.getElementById("part5").style.visibility = "hidden";
    $.ajax({
    	type: "POST",
    	async: false,
    	contentType: "application/json",
    	url: "/insertpayment/channels/mychannel/chaincodes/cl-cc",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cgb_token")
    	},
    	beforeSend: function() {
    		window.scrollTo(0, 0);
    		document.getElementById("div_gif").style.visibility = "visible";
    		$('#gif').attr('src', 'images/webview.gif');
    	},
    	data: JSON.stringify ({
    		"args": [e_applicationid,e_trascid,e_bname,e_amount,e_pdate,e_fullname,e_currency],
    		"peers": ["localhost:8051"],
    	}),
    	success: function(data) {
    		$("#journey3").attr("src","images/Journey3_Complete@2x.jpg");
    		$("#journey3").attr("style","visibility: visible;width:100%");
    		document.getElementById("div_gif").style.visibility = "hidden";
    		document.getElementById("done").style.visibility = "visible";
    	}
    });
    NotifyInsurance($("#applicationid2").val());
}
var CRM = {
    fullname: "李小明",
    sex: "M",
    id: "44011312345678901X",
    email: "xiaoming@gmail.com",
    address: "广东 番禺",
    residential: "2222 2222",
    mobilephone: "13933333333",
    cardnum: "8888 8888 8888 8888",
    accnum: "6666 6666 6666 6666",
    clientnum: "11666666"
}
function queryClient(ID){
    var Client = null;
    if(CRM.id===ID){
        Client = CRM;
    }
    return Client;
}
function QueryCRM(){
    var id = $("#searchTerm2").val();
    $("#ncalert").attr("style","visibility:hidden");
    if(id!=null){
        var client = queryClient(id);
        if(client != null){
            $("#fullname2").val(client.fullname);
            $("#sex2").val(client.sex);
            $("#id2").val(client.id);
            $("#email2").val(client.email);
            $("#address2").val(client.address);
            $("#residential2").val(client.mobilephone);
            $("#mobile2").val(client.mobilephone);
            $("#cardnum2").val(client.cardnum);
            $("#accnum2").val(client.accnum);
            $("#clientnum2").val(client.clientnum);
        }else{
            $("#fullname2").val("");
            $("#sex2").val("");
            $("#id2").val("");
            $("#email2").val("");
            $("#address2").val("");
            $("#residential2").val("");
            $("#mobile2").val("");
            $("#cardnum2").val("");
            $("#accnum2").val("");
            $("#clientnum2").val("");
            $("#ncalert").attr("style","visibility:visible");
        }
    }
}
function NotifyInsurance(applicationid){
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json",
        url: "/insertappid",
        data: JSON.stringify ({
            "applicationid": applicationid,
        }),
        success: function(data) {
        }
    });
}
