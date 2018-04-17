var globaltime = 0;
var notificationCount =0;
var intervalid = 0;
var ws = null;
var startedlogout= false;
function getJSON(url) {
    var resp ;
    var xmlHttp ;

    resp  = '' ;
    xmlHttp = new XMLHttpRequest();
    
    if(xmlHttp != null)
    {
        xmlHttp.open( "GET", url, false );
        xmlHttp.setRequestHeader("wesetit","WESETITTOSTOPBADPPL(>.<)");
        xmlHttp.send( null );
        resp = xmlHttp.responseText;
    }
    return resp ;
}

function generateGraph(){
	var resp = getJSON('/Twitter/twitter/feeds/allhashtags');
	var tags = JSON.parse(resp);
	var width = 543,
	    height = 600,
	    padding = 1.5, // separation between same-color nodes
	    clusterPadding = 6, // separation between different-color nodes
	    maxRadius = 100;

	var n = tags[0], // total number of nodes
	    m = tags[0]; // number of distinct clusters

	var color = d3.scale.category10()
	    .domain(d3.range(m));

	// The largest node for each cluster.
	var clusters = new Array(m);
	var cnt=1;
	var nodes = d3.range(n).map(function() {
	  var i = cnt++,
	      r = (tags[i].percentage/100)*maxRadius,
	      d = {
	        cluster: i,
	        radius: r,
	        hash: tags[i].tag,
	        percentage:tags[i].percentage,
	        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
	        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
	      };
	  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
	  return d;
	});

	var force = d3.layout.force()
	    .nodes(nodes)
	    .size([width, height])
	    .gravity(.02)
	    .charge(0)
	    .on("tick", tick)
	    .start();

	var svg = d3.select("svg")
	    .attr("width", width)
	    .attr("height", height);
	var tip = d3.tip()
	.attr('class', 'd3-tip')
	.offset([-10, 0])
	.html(function(d) {
	  return "<strong>"+ d.hash +":</strong> <span style='color:white'>"+d.percentage +"%</span>";
	});
	svg.call(tip);
	var node = svg.selectAll("circle")
	    .data(nodes)
	  .enter().append("circle")
	    .style("fill", function(d) { return color(d.cluster); })
	    .call(force.drag) .on('mouseover', tip.show)
	    .on('mouseout', tip.hide).on('click',function(d){loadSearchedFeeds(d.hash.substr(1));});

	node.transition()
	    .duration(750)
	    .delay(function(d, i) { return i * 5; })
	    .attrTween("r", function(d) {
	      var i = d3.interpolate(0, d.radius);
	      return function(t) { return d.radius = i(t); };
	    });

	function tick(e) {
	  node
	      .each(cluster(10 * e.alpha * e.alpha))
	      .each(collide(.5))
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
	  return function(d) {
	    var cluster = clusters[d.cluster];
	    if (cluster === d) return;
	    var x = d.x - cluster.x,
	        y = d.y - cluster.y,
	        l = Math.sqrt(x * x + y * y),
	        r = d.radius + cluster.radius;
	    if (l != r) {
	      l = (l - r) / l * alpha;
	      d.x -= x *= l;
	      d.y -= y *= l;
	      cluster.x += x;
	      cluster.y += y;
	    }
	  };
	}

	// Resolves collisions between d and all other circles.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  };
	}
}
function loadMe(){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/me');
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text("Profile");
    $("#mainfooter").text("Let people know who you are ");
    $("#text").css("display","none");
    $("#text1").css("display","block");
    pageScroll();
}

function loadOthersProfile(uid){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/me/' + uid);
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text($('#tmp-name').text());
    $("#mainfooter").text("Profile information ");
    $("#text").css("display","none");
    $("#text1").css("display","block");
    pageScroll();
}

function loadNotification(){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/notifications');
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text("Notifications");
    $("#mainfooter").text("See who just found out about you");
    $("#notify").text("");
    notificationCount=0;
    $("#text").css("display","none");
    $("#text1").css("display","block");
    createCookie();
    pageScroll();
}

function loadTags(){
    //var jsonArray;
    //jsonArray = getJSON('/Twitter/twitter/userapi/feeds/hashtagscounts');
    document.getElementById("text1").innerHTML = "<svg/>";
    generateGraph();
    $("#text").css("display","none");
    $("#text1").css("display","block");
    $("#mainheader").text("Hashtags");
    $("#mainfooter").text("Know what the world is saying #Respect");
    pageScroll();
}

function logout(){
	$.ajax({
		url : "/Twitter/logout.jsp",
		type : "GET",
		headers : {
			'wesetit' : 'WESETITTOSTOPBADPPL(>.<)'
		},
		success : function(data, textStatus) {
			window.location.href = '/Twitter/index.jsp';
		}
	});
	setTimeout(ws.close,2000);
	startedlogout=true;
}

function loadTweets(){
    var jsonArray;
    if(arguments.length>0)
        jsonArray = getJSON('/Twitter/twitter/userapi/feeds?refreshpic=true');
    else
        jsonArray = getJSON('/Twitter/twitter/userapi/feeds');
    document.getElementById("text").innerHTML = jsonArray;
    $("#text").css("display","block");
    $("#text1").css("display","none");
    $("#mainheader").text("Feeds");
    $("#mainfooter").text("See what your friends are upto");
}

function keepFeedUptodate(){
	if(feedson()){
		var jsonArray = getJSON('/Twitter/twitter/userapi/feeds_new/'+$('#latest_timestamp').text());
		if(!startedlogout){
				$('#text').prepend(jsonArray);
		}
	}
	if(!startedlogout){
		var notify = getJSON('/Twitter/twitter/countapi/notifications');
	    if(notify.charAt(0)!="{"){
	    	 location.reload(); 
	    }else{
		var notificationCount = JSON.parse(notify).count;
	    if(notificationCount==0){
	    	$("#notify").html("");
	    }else{
	    $("#notify").html(notificationCount);
	    }
	    }
	}	    
	keepFeedUptodate_1();
}

function createCookie() {
    var expires = "; expires=Wed Jul 29 2014 18:31:27 GMT+0530 (IST)";
    document.cookie = "lasttime"+"="+" "+expires+"; path=/";
    document.cookie = "lasttime="+new Date().getTime()+"; path=/";
}

function keepFeedUptodate_1(){
	if(!startedlogout){}
	setTimeout(keepFeedUptodate,1000);
}

function loadTrendingTags(){
    var hashArray = getJSON('/Twitter/twitter/feeds/hashtags');    
    document.getElementById("tags").innerHTML = hashArray;
}
function colapseta(){
    $("#collapseta").attr('class','collapse_ta_normal');
    $("#collapseta").attr('placeholder','Compose tweet ...');
}

function postTweet(){
	var user =getJSON('/Twitter/twitter/userapi/user');
	var jsonArray = JSON.parse(user);
	var uid = ""+jsonArray[0].UID;	
	var json = {};
	json["Tweet"]= $("#collapseta").val();
	if(json["Tweet"]!="" && json["Tweet"].length<151){
	json["Time"]=new Date().getTime();
	json["UID"]=uid;
	json["NextHashId"]=$('#nexthashid').text();
	colapseta();
	$("#collapseta").val("");
    $('#countdown').text(""+(150-$("#collapseta").val().length));
    setTimeout(loadUserInfo,1000);
	$.ajax({
	  url:"twitter/userapi/tweets/",
	  type:"POST",
	  headers:{'wesetit':'WESETITTOSTOPBADPPL(>.<)'},
	  data: JSON.stringify(json),
	  contentType:"application/json; charset=utf-8",
	  dataType:"json",
	  success: function(){
		  if($("#mainheader").text()=="Feeds"){
			  loadTweets();  
		  }
	  }
	});
	}
}


function loadUserInfo(){
    var cacheinvalid="";
    if(arguments.length>0){
        cacheinvalid="?query=a"+new Date().getMilliseconds();
    }
    var uname = getJSON('/Twitter/twitter/userapi/user');
    var name = JSON.parse(uname);
    var tweet = getJSON('/Twitter/twitter/countapi/tweets');
    var tweetCount = JSON.parse(tweet);
    var followers = getJSON('/Twitter/twitter/countapi/following');
    var followersCount = JSON.parse(followers);
    var follows = getJSON('/Twitter/twitter/countapi/followers');
    var profilepicuri = getJSON('/Twitter/twitter/userapi/getprofileuri');
    var followsCount = JSON.parse(follows);
    document.getElementById("Profile_inset").innerHTML = "<img class='img-rounded' width='26%' height='35%' id='prof-img' src = '"+profilepicuri+cacheinvalid+"' align = 'middle' vspace=5% style='margin-left:37.5%;margin-bottom:0px;padding:0px;'><h3 style='padding-top:0.5%;' align='middle' >"
    + name[0].Name + "</h3><div class='navbar-inverse'><table class='text-primary' cols=3 style='width:100%;text-align:center;'><tr><td><h4 style='cursor:hand;cursor:pointer;' onclick='loadTweetsForUser()'>Tweets</h4></td><td><h4 style='cursor:hand;cursor:pointer;' onclick='loadFollowerList()' >Followers</h4></td><td><h4 style='cursor:hand;cursor:pointer;' onclick='loadFollowingList()'>Following</h4></td></tr><tr><td>" + tweetCount.count + "</td><td>" +
    followsCount.count + "</td><td>" + followersCount.count + "</td></tr></table></div>";
}
function loadFollowDetails(){
	var hashArray = getJSON('/Twitter/twitter/userapi/whotofollow');    
    document.getElementById("Follow-inset").innerHTML = hashArray;
}

function socket() {
	if ("WebSocket" in window) {
		ws= new WebSocket("wss://arvind-2275:8443/Twitter/feeds/");
		ws.onmessage = function(evt) {
			var received_msg = evt.data;
			var json = JSON.parse(received_msg);
			for(var i in json){
				if(json[i].type=="N"){
					$("#notify").html(++notificationCount);
				}else if(json[i].type=="C"){
					location.reload();
				}else if(json[i].type=="U"){
					loadUserInfo();
				}else{
					if(feedson()){
					$('#text').prepend(json[i].data);
					}
				}
			}
		};
		ws.onclose = function() {
			location.reload();
		};
	} else {
		// The browser doesn't support WebSocket
		keepFeedUptodate_1();
	}
}

function follow(uid){
	json = {};
	json["NextHashId"]=$('#nexthashid').text();
    $.ajax({
    	  url:"/Twitter/twitter/userapi/follow/"+uid,
    	  type:"POST",
    	  headers:{'wesetit':'WESETITTOSTOPBADPPL(>.<)'},
    	  data: JSON.stringify(json),
    	  contentType:"application/json; charset=utf-8",
    	  dataType:"json"
    	});	
    $('#follow-but').attr("class","btn btn-success");
    $('#follow-but').text("✔ Followed");
    $('#follow-but').attr("onclick","unfollow('"+uid+"')");
    setTimeout(loadUserInfo,100);
    setTimeout(loadFollowDetails,100);
    if(feedson()){
        setTimeout(loadTweets(),100);
    }
}

function feedson(){
	 if($("#mainheader").text()=="Feeds"){
		return true;  
	  }
	 return false;
}


function loadFollowerList(){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/followers');
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text("Followers");
    $("#mainfooter").text("More the merrier ");
    $("#text").css("display","none");
    $("#text1").css("display","block");
    pageScroll();
}


function loadFollowingList(){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/following');
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text("Following");
    $("#mainfooter").text("These people really earned your attention ");
    $("#text").css("display","none");
    $("#text1").css("display","block");
    pageScroll();
    }

function  loadTweetsForUser(){
    var jsonArray;
    jsonArray = getJSON('/Twitter/twitter/userapi/tweets');
    document.getElementById("text1").innerHTML = jsonArray;
    $("#mainheader").text("Tweets");
    $("#mainfooter").text("All of your rantings put together ");
    $("#text").css("display","none");
    $("#text1").css("display","block");
    pageScroll();
    }
function unfollow(uid){
	json = {};
	json["NextHashId"]=$('#nexthashid').text();
    $.ajax({
  	  url:"/Twitter/twitter/userapi/unfollow/"+uid,
  	  type:"POST",
	  headers:{'wesetit':'WESETITTOSTOPBADPPL(>.<)'},
  	  data: JSON.stringify(json),
  	  contentType:"application/json; charset=utf-8",
  	  dataType:"json"
  	});	
    $('#follow-but').attr("class","btn btn-info");
    $('#follow-but').text("Follow");
    $('#follow-but').attr("onclick","follow('"+uid+"')");
    setTimeout(loadUserInfo,100);
    setTimeout(loadFollowDetails,100);
    if(feedson()){
        setTimeout(loadTweets(),100);
    }
}

function doajax(){
	 $.ajax({
         url : $(".nav_link").attr("href"),
         headers:{'wesetit':'WESETITTOSTOPBADPPL(>.<)'},
         success : function(html) {
             $(".nav_link").remove();
             if (html) {
                 $(".jscrolltext").append(html);
             }
        
             setTimeout( "$('.loading').hide();", 10);
         }
     });
}
function magic(){
    $(function() {
        $("#prof-img").on('click', function() {
            $("#hid_chooser").click();
        });
        $(window).scroll(function()
        {
                    if($(window).scrollTop() == $(document).height() - $(window).height())
                    {
                           if ($("#mainheader").text() == "Feeds"&&$(".nav_link")!=null&&$(".nav_link").attr("href").length>4) {
                            $('.loading').show();
                            setTimeout(doajax,10);
                        }
                   }else{
                       setTimeout( "$('.loading').hide();", 10);
                   }
        });
        $("#hid_chooser").on('change',function(){
        	$('#lastprofileuid').val($('#nexthashid').text());
            $("#hid_form").submit();
            loadUserInfo("a");
            $("#prof-img").on('click', function() {
                $("#hid_chooser").click();
            });
            if($("#mainheader").text()=="Feeds"){
                  loadTweets("a"); 
              }
        });
       
        $("#collapseta").on('focus',function(){
            $("#collapseta").attr('class','collapse_ta_expanded');
            $("#collapseta").attr('placeholder','');
        });
       
        $("#collapseta").on("blur", function( event ) {
        
        	 if($("#collapseta").val()==""){
        		colapseta();
        	 }
 
         });
    });
     function split( val ) {
         return val.split( / \s*/ );
         }
    function extractLast( term ) {
        var tmp = split( term ).pop();
         return tmp;
    }
   
     $(function() {
     var json = getJSON("/Twitter/twitter/userapi/allusersnames");
     var parsed = JSON.parse(json);
     var availableTags = [];
     
     for(var x in parsed){
       availableTags.push(parsed[x]);
     }
     $( "#search-box" ).autocomplete({
         minLength:3,
         source: availableTags,
         focus: function( event, ui ) {
             // $( "#search-box" ).val( ui.item.Name );
             return false;
             },
        select: function (event,ui){
            setTimeout(loadUserInfo,100);
            $( "#search-box" ).val("");
            return false;
        }
     }).autocomplete( "instance" )._renderItem = function( ul, item ) {
         return $( "<li>" )
         .append( "<a onclick='loadOthersProfile(\""+item.UID+"\")'><table style='table-layout:fixed;' cols=3><tr><td width=20% height=37px>"
                 +"<img class='img-circle' src = '/Twitter/twitter/userapi/profile/"+item.UID+"' width='35px' height='35px'></td><td width=8%></td><td>"+     
                "<h5>"+ item.Name+ "</h5><h6>View profile</h6></td></tr></table>" + "</a>" )
         .appendTo( ul );
         };
     json = getJSON("/Twitter/twitter/feeds/allhashtags");
     parsed = JSON.parse(json);
     availableTags = [];
     for(var x in parsed){
           availableTags.push(parsed[x]);
         }
         
     json = getJSON("/Twitter/twitter/userapi/allfriends");
     parsed = JSON.parse(json);
     for(var x in parsed){
           availableTags.push(parsed[x]);
         }
         $( "#collapseta" )
         .bind( "keydown", function( event ) {
         if ( event.keyCode === $.ui.keyCode.TAB &&
         $( this ).autocomplete( "instance" ).menu.active ) {
         event.preventDefault();
         }
         })
         .autocomplete({
         minLength: 4,
         source: function( request, response ) {
         response( $.ui.autocomplete.filter(
         availableTags, extractLast( request.term ) ) );
         },
         search: function( event, ui ) {
             if($("#collapseta").val().split( / \s*/ ).pop().substring(0,1)!="#"&&$("#collapseta").val().split( / \s*/ ).pop().substring(0,1)!="@"){
                 event.preventDefault();
             }
             else if ($("#collapseta").val().split( / \s*/ ).pop().length<4){
                 event.preventDefault();
             }
         },
         
         focus: function() {
         return false;
         },
         position: { my : "left bottom", at: "top center" },
         select: function( event, ui ) {
         var terms = split( this.value );
         terms.pop();
         terms.push( ui.item.value );
         terms.push( "" );
         this.value = terms.join( " " );
         return false;
         }
         });
     
     });
     $("#collapseta").on("keydown", function () {
         $('#countdown').text(""+(150-(this.value.length)));
         var newY = $(this).textareaHelper('caretPos').top + (parseInt($(this).css('font-size'), 10) * 1.5);
         var newX = $(this).textareaHelper('caretPos').left;
         var posString = "left+" + newX + "px top+" + newY + "px";
         $(this).autocomplete("option", "position", {
             my: "left top",
             at: posString
         });
     });     
     socket();
}
function loadHome(){
    loadTweets();
    pageScroll();
}

function pageScroll() {
    window.scrollTo(0,0);
}

function loadSearchedFeeds(query){
    jsonArray = getJSON('/Twitter/twitter/userapi/searchfeeds?query='+query);
    document.getElementById("text").innerHTML = jsonArray;
    $("#mainheader").text("Tag Results");
    var str= query;
    if(query.length > 20) str = query.substring(0,20)+" ...";
    $("#mainfooter").text("The tag #"+str+" appears in the following");
    $("#text").css("display","block");
    $("#text1").css("display","none");
    pageScroll();
}