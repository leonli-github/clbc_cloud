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
        		data: "username=chinalife&orgName=org1",
        		success: function(data) {
                		window.location.href = "main.html";
                		console.log(data);
				$.cookie("cl_token", data.token);
			}
		});
            }
        }
    });
    e.preventDefault(); // avoid to execute the actual submit of the form.
});
var sex ;
var fullname ;
var id ;
var email ;
var address ;
var residential ;
var mobile ;
var policy ;
var plan ;
var sum ;
var currency ;
function validate1() {
    sex = document.forms["myForm1"]["sex"].value;
    fullname = document.forms["myForm1"]["fullname"].value;
    id = document.forms["myForm1"]["id"].value;
    email = document["myForm1"]["email"].value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    address = document.forms["myForm1"]["address"].value;
    residential = document.forms["myForm1"]["residential"].value;
    mobile = document.forms["myForm1"]["mobile"].value;
    if (fullname == "") {
        alert("Full name must be filled out");
        document.forms["myForm1"]["fullname"].setfocus;
        return false;
    }
    else if (sex == "Sex") {
        alert("Sex must be selected");
        document.forms["myForm1"]["sex"].setfocus;
        return false;
    }
    else if (id == "") {
        alert("Identity Number must be filled out");
        document.forms["myForm1"]["id"].setfocus;
        return false;
    }
    else if (!filter.test(email)) {
        alert("Please provide a valid email address");
        document.forms["myForm1"]["email"].setfocus;
        return false;
    }
    else if (address == "") {
        alert("Address must be filled out");
        document.forms["myForm"]["address"].setfocus;
        return false;
    }
    else if (residential == "") {
        alert("Residential phone number must be filled out");
        document.forms["myForm1"]["residential"].setfocus;
        return false;
    }
    else if (mobile == "") {
        alert("Mobile phone number must be filled out");
        document.forms["myForm1"]["mobile"].setfocus;
        return false;
    }
    else {
        document.getElementById("part2").style.visibility = "visible";
        document.getElementById("part1").style.visibility = "hidden";
        $('#part1').replaceWith($('#part2'));
        $("#journey2").attr("src","images/Journey2_Complete@2x.jpg");
        $("#journey4").attr("src","images/Journey4_@2x.jpg");
        $("#journey4").attr("style","visibility: visible;width:100%");
        policy = (Math.floor(Date.now() / 1000)).toString();
        $('.policy').attr("placeholder", policy);
        window.scrollTo(0, 0);
    }
}
function validate2() {
    $('.appnum').attr("placeholder", policy);
    plan = document.forms["myForm2"]["plan"].value;
    sum = document.forms["myForm2"]["sum"].value;
    currency = document.forms["myForm2"]["currency"].value;
    if (policy == "") {
        alert("Policy must be filled out");
        document.forms["myForm2"]["policy"].setfocus;
        return false;
    }
    else if (plan == "") {
        alert("Plan name must be filled out");
        document.forms["myForm2"]["plan"].setfocus;
        return false;
    }
    else if (sum == "") {
        alert("Sum assured must be filled out");
        document.forms["myForm2"]["sum"].setfocus;
        return false;
    }
    else if (currency == "Currency") {
        alert("Currency must be selected");
        document.forms["myForm2"]["currency"].setfocus;
        return false;
    }
    else {
        document.getElementById("part5").style.visibility = "visible";
        document.getElementById("part2").style.visibility = "hidden";
        $("#journey4").attr("src","images/Journey4_Complete_@2x.jpg");
        $("#journey1").attr("src","images/Journey1_@2x.jpg");
        $("#journey1").attr("style","visibility: visible;width:100%");
    }
}
function upload_file2() {
    $('#file2_check').attr('src', 'images/UploadForm_Complete@1x.jpg');
    $('#file2').attr('src', 'images/File2@1x.jpg');
    $('#file2').attr('style', 'this.width:70%');
}
function upload_file1() {
    $('#file1_check').attr('src', 'images/UploadForm_Complete@1x.jpg');
    $('#file1').attr('src', 'images/File1@1x.jpg');
    $('#file1').attr('style', 'this.width:70%');
}
function validate3() {
    $("#journey1").attr("src","images/Journey1_Complete_@2x.jpg");
    document.getElementById("part6").style.visibility = "visible";
    document.getElementById("part5").style.visibility = "hidden";
    $('#journey5').attr('src', 'images/Journey5@2x.jpg');
    $("#journey5").attr("style","visibility: visible;width:100%");
}
function part3() {
    document.getElementById("part3").style.visibility = "visible";
    document.getElementById("part4").style.visibility = "hidden";
    document.getElementById("part2").style.visibility = "hidden";
    document.getElementById("part5").style.visibility = "hidden";
    document.getElementById("part6").style.visibility = "hidden";
    document.getElementById("part7").style.visibility = "hidden";
    $('#button1').attr('src', 'images/客户申请@1x.jpg');
    $('#button3').attr('src', 'images/保单查询@1x.jpg');
    Clean();
    GenerateDefault();
}
function part4() {
    document.getElementById("part4").style.visibility = "visible";
    document.getElementById("part3").style.visibility = "hidden";
    document.getElementById("part2").style.visibility = "hidden";
    document.getElementById("part5").style.visibility = "hidden";
    document.getElementById("part6").style.visibility = "hidden";
    document.getElementById("part7").style.visibility = "hidden";
    $('#button1').attr('src', 'images/客户申请@1x.jpg');
    $('#button2').attr('src', 'images/账户资料@1x.jpg');
    Clean();
}
function last_confirm() {
    var e_id= encrypt(id);
    var e_fullname = encrypt(fullname);
    var e_sex = encrypt(sex);
    var e_address = encrypt(address);
    var e_residential = encrypt(residential);
    var e_mobile = encrypt(mobile);
    var e_policy = encrypt(policy);
    var e_plan = encrypt($("#plan option:selected").text());
    var e_sum = encrypt(sum);
    var e_date = encrypt(Date().toString());
    var e_currency = encrypt(currency);
    var e_email = encrypt(email);
    document.getElementById("part7").style.visibility = "visible";
    document.getElementById("part6").style.visibility = "hidden";
    $.ajax({
    	type: "POST",
    	async: false,
    	contentType: "application/json",
    	url: "/insertkyc/channels/mychannel/chaincodes/cl-cc",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cl_token")
    	},
    	data: JSON.stringify ({
    		"args": [e_id, e_fullname, e_sex, e_address, e_residential, e_mobile, e_policy, e_plan, e_sum, e_date, e_currency, e_email],
    		"peers": ["localhost:7051"],
    	}),
    	beforeSend: function() {
    		window.scrollTo(0, 0);
    		document.getElementById("div_gif").style.visibility = "visible";
    		$('#gif').attr('src', 'images/webview.gif');
    	},
    	success: function(data) {
    		$("#journey6").attr("src","images/Journey6_Complete@2x.jpg");
    		document.getElementById("div_gif").style.visibility = "hidden";
    		document.getElementById("done").style.visibility = "visible";
    	}
    });       
}
function QueryByAppID(){
    var ApplicationID = document.getElementById("searchTerm1").value;
    var e_appid = encrypt(ApplicationID);
    if (ApplicationID == "" || ApplicationID.length != 10) {
        alert("Application ID must be filled out.");
        return false;
    }
    Clean();
    $("#searchTerm1").val(ApplicationID);
    $.ajax({
    	type: "GET",
    	async: false,
    	contentType: "application/json",
    	url: "/querypayment/channels/mychannel/chaincodes/cl-cc?peer=peer1&args=%5B%22"+encodeURIComponent(e_appid)+"%22%5D",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cl_token")
    	},
    	success: function(data) {
    		if(data.length ===0) {
    			if( $("td#content").length){
    				$("td#content").parent().remove();
    			}
    			NoResult();
    		}else {
    			GenerateTR(data);
    		}
    	}
    });
}
function GenerateTR(data){
    var template = "<tr id='sec'><td id='content'>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td><img class='approve' src='' style='visibility:visible;width:100%;'></td></tr>";
    var obj = JSON.parse(data);
    var appid = document.getElementById("searchTerm1").value
    template = template.replace("{0}",appid);
    template = template.replace("{1}",decrypt(obj["fullname"]));
    template = template.replace("{2}",decrypt(obj["transactionid"]));
    template = template.replace("{3}",decrypt(obj["bankname"]));
    template = template.replace("{4}",decrypt(obj["policycurrency"]));
    template = template.replace("{5}",decrypt(obj["paymentamount"]));
    template = template.replace("{6}",decrypt(obj["paymentdate"]));
    if($(".third").length){
        $(".third").remove();
    }
    if( $("td#content").length){
        $("td#content").parent().replaceWith(template);
    }
    else{
        $('#accounttable').append(template);
    }
    if (statuscontain(appid) === true) {
        $('.approve').attr("src", "images/right.png");
        $('.approve').click(function(){
            var appid = $(this).closest('tr').find('td:first-child').text();
            $.ajax({
                type: "POST",
                async: false,
                contentType: "application/json",
                url: "/approveappid",
                data:JSON.stringify ({
                    "applicationid": appid
                }),
                success: function(data) {
                    $('.approve').attr("src", "images/yes.png");
                    $.ajax({
                        type: "GET",
                        async: false,
                        contentType: "application/json",
                        url: "/getinvalidappid",
                        success: function(data) {
                            statusobj = JSON.parse(data);
                        }
                    });
                }
            });
        });
    }
    else {
        $('.approve').attr("src", "images/yes.png");
    }
}
function Clean(){
    if( $("td#content").length){
        $("td#content").parent().remove();
    }
    if($(".third").length){
        $(".third").remove();
    }
    $("#searchTerm1").val("");
    $("#searchTerm1").focus();
    $("#searchTerm2").val("");
    $("#searchTerm2").focus();

    $('.sidebar').children('img').each(function () {
        if($(this).attr("id")!="journey") {
            $(this).attr("style", "visibility: hidden");  // "this" is the current element in the loop
        }
    });
    $("#part7").attr("style","visibility: hidden");
}
function zoom(zm) {
    img=document.getElementById("pdfdoc")
    wid=img.width
    ht=img.height
    img.style.width=(wid*zm)+"px"
    img.style.height=(ht*zm)+"px"
}
var sd = new Date();
var n = sd.toLocaleDateString();
function sign() {
    $('#signature').attr("src", "images/准保单持有人签署_signed@1x.jpg");
    $('#signdate').attr("value", "Signed: " + n);
    $("#journey5").attr("src","images/Journey5_Complete@2x.jpg");
    $("#journey6").attr("src","images/Journey6@2x.jpg");
    $("#journey6").attr("style","visibility: visible;width:100%");
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
var statusobj = null;
function GenerateDefault(){
    $.ajax({
        type: "GET",
        async: false,
        contentType: "application/json",
        url: "/getinvalidappid",
        success: function(data) {
        	statusobj = JSON.parse(data);
            	for(var i = statusobj.applications.length; i--;){
                	Generatetr(statusobj.applications[i].id);
            	}
        }
    });
}
function Generatetr(applicationid){
    var e_appid = encrypt(applicationid);
    $.ajax({
    	type: "GET",
    	async: false,
    	contentType: "application/json",
    	url: "/querypayment/channels/mychannel/chaincodes/cl-cc?peer=peer1&args=%5B%22"+encodeURIComponent(e_appid)+"%22%5D",
    	headers: {
    		"Authorization": "Bearer " + $.cookie("cl_token")
    	},
    	success: function(data) {
    		var template = "<tr class='third'><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td>{5}</td><td>{6}</td><td><img class='approve' src='images/right.png' style='visibility:visible;width:100%;'></td></tr>";
    		var obj = JSON.parse(data);
    		template = template.replace("{0}",applicationid);
    		template = template.replace("{1}",decrypt(obj["fullname"]));
    		template = template.replace("{2}",decrypt(obj["transactionid"]));
    		template = template.replace("{3}",decrypt(obj["bankname"]));
    		template = template.replace("{4}",decrypt(obj["policycurrency"]));
    		template = template.replace("{5}",decrypt(obj["paymentamount"]));
    		template = template.replace("{6}",decrypt(obj["paymentdate"]));
    		$('#accounttable').append(template);
    		$('.approve').click(function(){
    			var appid = $(this).closest('tr').find('td:first-child').text();
                        $.ajax({
                        	type: "POST",
				async: false,
                    	        contentType: "application/json",
                    	        url: "/approveappid",
                     	       	data:JSON.stringify ({
                    	            "applicationid": appid
				}),
				success: function(data) {
                                	$.ajax({
                                    		type: "GET",
                                   		async: false,
                                    		contentType: "application/json",
                                    		url: "/getinvalidappid",
                                    		success: function(data) {
                                        		statusobj = JSON.parse(data);
                                    		}
                                	});
                            	}
    			});
			$(this).attr("src", "images/yes.png");
    		});
	}
    });
}
function approve(){
    alert( $(this).parent .index(this));
}
function statuscontain(appid){
    var contain = false;
    for(var i = statusobj.applications.length; i--;){
        if(appid === statusobj.applications[i].id){
            contain = true;
        }
    }
    return contain;
}
