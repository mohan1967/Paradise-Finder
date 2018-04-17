<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<script type='text/javascript' src="js/jquery-1.11.1.min.js"></script>
<script type='text/javascript' src="js/md5.js"></script>
<link rel="stylesheet" href="css/jquery-ui.css"/>
<script src="js/jquery-ui.js"></script>
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
<link href="css/bootstrap-theme.css" rel="stylesheet" type="text/css" />

<title>Paradise Finder</title>
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>

<style> html{display:none;} </style>
<script>
   if(self == top) {
       document.documentElement.style.display = 'block'; 
   } else {
       top.location = self.location; 
   }
</script>

<body>
<%
request.getSession().removeAttribute("details");
//Set standard HTTP/1.1 no-cache headers.
response.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");
//Set standard HTTP/1.0 no-cache header.
response.setHeader("Pragma", "no-cache");
%>
<div class="navbar-inverse" id="notifybar" style="display:none;" ><h2 id = "validatemsg" style="color:white;text-align:center;"></h2></div>
<div id="signin_div">
<!-- Box Start-->
<div id="box_bg">

<div id="content">
	<h1>Paradise Finder</h1>
	
	<!-- Social Buttons -->
	<div class="social">
	Sign in using social network:<br/>
	<div class="twitter"><a href="loginpath" class="btn_1">Login with Linkedin		</a></div>
	
	</div>
	
	<!-- Login Fields -->
	<div id="login">Sign in using your registered account:<br/>
	<form method="post" name = "myform" id = "signinform" >
	<div id="un"><input id='usern' type="text" name='username' onblur="if(this.value=='')this.value='Nickname';" onfocus="if(this.value=='Nickname')this.value='';" value="Nickname" class="login user"/></div>
	<div id="pw"><input id='passwd' type='text' name='password' value='Password'  onfocus="if(this.value=='' || this.value == 'Password') {this.value='';this.type='password'}"  onblur="if(this.value == '') {this.type='text';this.value=this.defaultValue}" class="login password"/></div>
		<!-- Green Button -->
	<div class="button green" name="submit"><input type="button" value="Sign In" onclick="exchangehash()" ></div>
	</form>
	</div>
	


	<!-- Checkbox -->
<br/>
<br></br>
</div>
</div>

<!-- Text Under Box -->
<div id="bottom_text" style="font-size:15px;color:black">
	Don't have an account? <a type="button" id="signup"> Sign Up</a><br/>
	
</div>
</div>

<div id = "signup_div" style="display:none;">
<div id="box_bg">

<div id="content">

	<h1 class="blue">Register</h1>

	<!-- Register Fields -->
	<div id="reg">
	<form method="post" id="defferedform" >
	<fieldset>
	<input type="hidden" name="tok" ></input>
	<input type="text" id="name" name='name' onblur="if(this.value=='')this.value='Name';" onfocus="if(this.value=='Name')this.value='';" required value="Name" class="register"/>
	<input type="text" id="email" name='email' onblur="if(this.value=='')this.value='Email';" required onfocus="if(this.value=='Email')this.value='';" value="Email"  class="register"/>
	<input type="text" name='mobile' onblur="if(this.value=='')this.value='Mobile';" onfocus="if(this.value=='Mobile')this.value='';" required pattern="[0-9]*" value="Mobile" class="register"/>
	<input type="text" id="handle" title="Your unique @ handle" name='nickname' required  onblur="if(this.value==''){this.value='Nickname';}else{blurNick();}" onfocus="if(this.value=='Nickname')this.value='';" value="Nickname" class="register"/>
	<input type='text' id="pass" name='password' title='Minumum of 8 characters' value='Password'  required onfocus="if(this.value=='' || this.value == 'Password') {this.value='';this.type='password'}"  onblur="if(this.value == '') {this.type='text';this.value=this.defaultValue}" class="register"/>
	<input type='text' id="passc" value="Confirm Password" required onfocus="if(this.value=='' || this.value == 'Confirm Password') {this.value='';this.type='password'}"  onblur="if(this.value == '') {this.type='text';this.value=this.defaultValue}" class="register"/>
	<div class="button blue"><input type="button" value="Register" onclick="validate()"/></div>
	</fieldset>
	</form>
	
	</div>
	
	<!-- Blue Button -->
	
	

</div>
</div>

<!-- Text Under Box -->
<div id="bottom_text">
	Already have an account?<a  id="blue" class="signin12" > Sign In</a><br/>
</div>
</div>

<script>
$(".signin12").on('click',function() {
	$("#signup_div").css("display","none");
	$("#signin_div").css("display","block");
});
$("#signup").on('click',function() {
	$("#signup_div").css("display","block");
	$("#signin_div").css("display","none");
});

function validate()
{
    var pass=document.myform.password.value;
    var hash = CryptoJS.SHA3(pass, { outputLength: 256 });
    document.myform.password.value = hash;
    checkUnique();
    setTimeout(defferedsubmit,1000);
}

function errortype(){
	$('#passwd').addClass('error');
	$('#tmp_script').remove();
}

function defferedsubmit(){
	 if(validateSubmit()){
	    	$('#defferedform').attr("action","createAccount.jsp");
	    	$('#defferedform').submit();
	 }
}

function exchangehash(){
	var pass=document.myform.password.value;
	if(pass.length>7){
    var hash = CryptoJS.SHA3(pass, { outputLength: 256 });
    document.myform.password.value = hash;
	$('#signinform').attr("action","signin");
	$('#signinform').submit();}
}

function validateSubmit()
{
    var username=$('#name').val();
    if(username=="Name")
        {
    	$('#name').removeClass("correct");

    	$('#name').addClass("register wrong");
        return false;
        }else{
        	$('#name').removeClass("wrong");
        	$('#name').addClass("register correct");
        }
   if($('#handle').hasClass("wrong"))
   {
	   return false;
   }
    var email = $('#email').val();
    if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(email)) || email=="" || email==null) {
    	$('#email').removeClass("correct");
    	$('#email').addClass("register wrong");
        return false;
    } else{
    	$('#email').removeClass("wrong");
    	$('#email').addClass("register correct");
    }
    var pass=$('#pass').val();
   /*
    if(pass=="Password")
    {
    	$('#pass').removeClass("correct");
    	$('#pass').addClass("register wrong");
    	return false;
    }else{
    	$('#pass').removeClass("wrong");
    	$('#pass').addClass("register correct");
    }
  */ 
    if(pass.length < 8)
    {
    	$('#pass').removeClass("correct");
    	$('#pass').addClass("register wrong");
    	return false;
    }
   
    var confirm=$('#passc').val();

    if(pass!=confirm)
        {
    	$('#passc').removeClass("correct");
    	$('#passc').addClass("register wrong");
        return false;
        }else{
        	$('#passc').removeClass("wrong");
        	$('#passc').addClass("register correct");

        }

    // Validate Email
   
    var pass=$('#pass').val();
    var hash = CryptoJS.SHA3(pass, { outputLength: 256 });
    $('#pass').val(hash);   
    $('#passc').val(hash);   
    return true;
}
function initblurs(){
	$('#pass').on('blur',function(){
		  var pass=$('#pass').val();
		   
		    if(pass=="Password")
		    {
		    	$('#pass').removeClass("correct");
		    	$('#pass').addClass("register wrong");
		    	displaymsg("Enter your paassword");
		    }else{
		    	
		    	$('#pass').removeClass("wrong");
		    	$('#pass').addClass("register correct");
		    }
		   
		    if(pass.length < 8)
		    {
		    	displaymsg("Minimum of 8 characters");
		    	$('#pass').removeClass("correct");
		    	$('#pass').addClass("register wrong");
		    }
	});
$('#passc').on('blur',function(){
	 var confirm=$('#passc').val();

	    if(pass!=confirm)
	        {
	    	displaymsg("Password mismatch");
	    	$('#passc').removeClass("correct");
	    	$('#passc').addClass("register wrong");
	        }
	});
}
function checkUnique(){
	var l = $.ajax({
		  url:"twitter/feeds/uniquecheck",
		  type:"POST",
		  headers : {
				'wesetit' : 'WESETITTOSTOPBADPPL(>.<)'},
		  data: '{uname:"'+$('#handle').val()+'"}',
		  contentType:"application/json; charset=utf-8",
		  dataType:"text",  
		  success : function(text)
	         {
			  if(text!="false"){
				  	$('#handle').removeClass("wrong");
					$('#handle').addClass("register correct");
				}else{
					$('#handle').removeClass("correct");
					$('#handle').addClass("register wrong");		
				}
	         }
		});
	return l;
}

function blurNick(){
	if(this.value!='Nickname') {
		checkUnique();
	}
}

function hidenotifybar(){
	$('#notifybar').hide();
}
function displaymsg(msg){
	$('#validatemsg').text(msg);
	$('#notifybar').effect( "fade", "slow");
	setTimeout(hidenotifybar,1000);
}
initblurs();
</script>
</body>
</html>