<%@page import="java.util.HashSet"%>
<%@page import="java.util.HashMap"%>
<%@page import="login.TwitterLogin"%>

<%@ page language="java" contentType="text/html; charset=windows-1256" pageEncoding="windows-1256" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html> <head> <meta http-equiv="Content-Type" content="text/html; charset=windows-1256">
<title> User Logged Successfully </title>
</head>
<body>
<center>

<%@ page import="java.io.BufferedReader"%>
<%@ page import="java.io.BufferedWriter"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.io.InputStreamReader"%>
<%@ page import="java.io.OutputStreamWriter"%>
<%@ page import="java.io.UnsupportedEncodingException"%>
<%@ page import="java.net.HttpURLConnection"%>
<%@ page import="java.net.MalformedURLException"%>
<%@ page import="java.net.URL"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.security.GeneralSecurityException"%>
<%@ page import="java.util.ArrayList"%>
<%@ page import="java.util.Random"%>
<%@ page import="javax.crypto.Mac"%>
<%@ page import="javax.crypto.spec.SecretKeySpec"%>
<%@ page import="javax.net.ssl.HttpsURLConnection"%>


<%

HashMap<String,String> details=new HashMap<String,String>();
String obj=(String)session.getAttribute("userinfo");
if(obj != null && obj.equals(""))
{
    response.sendRedirect("index.jsp");
    return;
}
out.println(obj.toString());
%>
<div>
<h2>Please enter the location where you want the apartments to be suggested.</h2>

<form action="javascript:validate();">
Location: <input type="text" id="loc" name="Location" ><br>
<input type="submit" value="Submit" style="margin-top: 12px;">
</form>
</div>

<div id="content">

</div>
<script type="text/javascript">

function validate(){
	var loc = document.getElementById("loc");
	url ="/SWProject/data/control";
	sendRequestWithCallback(url, "location="+loc.value, true, callbackfn);
}

function sendRequestWithCallback(action, params, async, callback) {
    var objHTTP = xhr();
    objHTTP.open('POST', action, async);
    objHTTP.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
    if(async){
	objHTTP.onreadystatechange=function() {
	    if(objHTTP.readyState==4) {
		if(callback) {
		    callback(objHTTP.responseText);
		}
	    }
	};
    }
    objHTTP.send(params);
    if(!async) {
	if(callback) {
            callback(objHTTP.responseText);
        }
    }
} 


function xhr() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
	xmlhttp=new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
	try {
	    xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch(e) {
	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
    }
    return xmlhttp;
}

function callbackfn(response){
	var data = JSON.parse(response);
	document.getElementById("content").innerHTML = response;
}
</script>