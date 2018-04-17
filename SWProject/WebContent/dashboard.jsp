<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.HashMap"%>
<link href="css/w3.css" rel="stylesheet" type="text/css" />
<%

String obj=(String)session.getAttribute("userinfo");
JSONObject json = new JSONObject(obj);
JSONArray detailsArray= (JSONArray)session.getAttribute("details");

%>
<%if(detailsArray == null){ %>
<body  onload="validate()">
<%}else{ %>
<body>
<%} %>
<div id="demo">
<h1 style="margin-left: 50%;">PARADISE FINDER</h1>
  <h1>Welcome, <%=json.getString("firstName") %></h1>
  
  <!-- Responsive table starts here -->
  <!-- For correct display on small screens you must add 'data-title' to each 'td' in your table -->
  <div class="table-responsive-vertical shadow-z-1"  Style="margin-left: -5%;">
  <!-- Table starts here -->

  
  
  <div>
    <h3>Custom searched apartments based on your place of work!</h3>
  </div>
  <%if(detailsArray != null){ %>
  <table id="table" class="table table-hover table-mc-light-blue" Style="display:block;">
      <thead>
        <tr>
          <th>ID</th>
          <th  style="padding: 0px 10px 0 10px;">Address</th>
          <th  style="padding: 0px 15px 0 15px;">Finished Sq. Ft</th>
          <th  style="padding: 0px 15px 0 15px;">BedRooms</th>
          <th  style="padding: 0px 10px 0 10px;">BathRooms</th>
          <th  style="padding: 0px 10px 0 10px;">Year Built</th>
          <th  style="padding: 0px 10px 0 10px;">Score</th>
          <th  style="padding: 0px 100px 0 90px">Comments</th>
          <th  style="padding: 0px 10px 0 10px;">Home Details</th>
          <th  style="padding: 0px 10px 0 10px;">Directions</th>
          
          
        </tr>
      </thead>
      <tbody>
      <%for(int i=0; i<detailsArray.length(); i++){ 
      JSONObject details =(JSONObject) detailsArray.get(i);
      %>
        <tr>
          <td data-title="ID"><%=i+1 %></td>
          <td data-title="address" style="text-align: center;padding: 20px 0 0 0;"><%= details.optString("address")%></td>          
          <td data-title="sqft" style="text-align: center;padding: 20px 0 0 0;"><%= details.optString("finishedSqFt")%></td>
          <td data-title="bedrooms" style="text-align: center;padding: 20px 0 0 0;"><%= details.optString("bedrooms")%></td>
          <td data-title="bathrooms" style="text-align: center;padding: 20px 0 0 0;"><%= details.optString("bathrooms")%></td>
          <td data-title="yearBuilt" style="text-align: center;padding: 20px 0 0 0;"><%= details.optString("yearBuilt")%></td>
          <td data-title="yearBuilt" style="text-align: center;padding: 20px 0 0 20px;  white-space: nowrap;"><%= details.optString("score")%></td>
          <td data-title="yearBuilt" style="text-align: center;padding: 20px 0 0 20;  white-space: nowrap;"><%= details.optString("comments")%></td>
          <td data-title="Link" style="text-align: center;padding: 20px 0 0 0;">
            <a href=<%= details.optString("homedetails")%> target="_blank">Contact</a>
          </td>
          <td data-title="Link" style="text-align: center;padding: 20px 0 0 0;">
            <a href=<%= "https://www.google.com/maps/place/"+ details.optString("address").replace(" ", "+")%> target="_blank">Directions</a>
          </td>
        </tr>
        <%} %>
        <%} %>
      </tbody>
    </table>
    
      
  <h2 style=" margin-top: 4%;"> Refine your search? Please enter the location where you want the apartments to be suggested.</h2>

<form action="javascript:validate();">
<b>Location:</b> <input type="text" id="loc" name="Location" ><br>
<input type="submit" value="Submit" style="margin-top: 12px;">
</form>
</div>
  </div>
  </body>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>


<script type="text/javascript">

function validate(){
	var loc = document.getElementById("loc");
	url ="/SWProject/data/control";
	sendRequestWithCallback(url, "location="+loc.value, true, callbackfn);
}

function reload(){
	location.reload();
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
	location.reload();	
}
</script>


<script>

/**
 * Created by Kupletsky Sergey on 05.11.14.
 *
 * Material Design Responsive Table
 * Tested on Win8.1 with browsers: Chrome 37, Firefox 32, Opera 25, IE 11, Safari 5.1.7
 * You can use this table in Bootstrap (v3) projects. Material Design Responsive Table CSS-style will override basic bootstrap style.
 * JS used only for table constructor: you don't need it in your project
 */

$(document).ready(function() {

    var table = $('#table');

    // Table bordered
    $('#table-bordered').change(function() {
        var value = $( this ).val();
        table.removeClass('table-bordered').addClass(value);
    });

    // Table striped
    $('#table-striped').change(function() {
        var value = $( this ).val();
        table.removeClass('table-striped').addClass(value);
    });
  
    // Table hover
    $('#table-hover').change(function() {
        var value = $( this ).val();
        table.removeClass('table-hover').addClass(value);
    });

    // Table color
    $('#table-color').change(function() {
        var value = $(this).val();
        table.removeClass(/^table-mc-/).addClass(value);
    });
});

// jQuerys hasClass and removeClass on steroids
// by Nikita Vasilyev
// https://github.com/NV/jquery-regexp-classes
(function(removeClass) {

	jQuery.fn.removeClass = function( value ) {
		if ( value && typeof value.test === "function" ) {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];
				if ( elem.nodeType === 1 && elem.className ) {
					var classNames = elem.className.split( /\s+/ );

					for ( var n = classNames.length; n--; ) {
						if ( value.test(classNames[n]) ) {
							classNames.splice(n, 1);
						}
					}
					elem.className = jQuery.trim( classNames.join(" ") );
				}
			}
		} else {
			removeClass.call(this, value);
		}
		return this;
	}

})(jQuery.fn.removeClass);
</script>

