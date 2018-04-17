package login;

import java.net.URLEncoder;
import java.util.HashMap;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;






public class LinkedinResponse extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException { 
		HashMap<String,String> details=new HashMap<String,String>();
		String requestToken=request.getParameter("oauth_token");
		//tokensecret=request.getParameter("oauth_token_secret");
		
		String oauthResponseUrl = LinkedinLogin.callback; 
		String accessTokenUrl = "https://www.linkedin.com/uas/oauth2/accessToken";
		String requestParams = "";
		requestParams += "code=" + URLEncoder.encode(request.getParameter("code"), "UTF-8"); //No I18N
		requestParams += "&client_id=" + URLEncoder.encode(LinkedinLogin.CONSUMER_KEY, "UTF-8");
		requestParams += "&client_secret=" + URLEncoder.encode(LinkedinLogin.CONSUMER_SECRET, "UTF-8");
		requestParams += "&redirect_uri=" +URLEncoder.encode(LinkedinLogin.callback, "UTF-8");
		requestParams += "&grant_type=authorization_code";  //No I18N
		int connectionTimeOut = 3000;
		accessTokenUrl += "?"+requestParams;
		String accesstoken;
			response.getWriter().println();
			try {
				JSONObject json = new JSONObject(LinkedinLogin.getUrlObj(accessTokenUrl, "GET"));
				response.getWriter().println("testing");
				String accessToken = json.getString("access_token");
				String dataFetchUrl = "https://api.linkedin.com/v1/people/~:";
				dataFetchUrl += "(id,first-name,last-name,industry,public-profile-url,picture-url,headline,skills,positions)"; //No I18N
				dataFetchUrl += "?format=json" + "&oauth2_access_token=" + accessToken; //No I18N
				String res = LinkedinLogin.getUrlObj(dataFetchUrl, "GET");
				request.getSession().setAttribute("userinfo", res);
				response.sendRedirect("/SWProject/dashboard.jsp");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				response.getWriter().println(e);
			}
			//.getString("access_token");
			
			/*
			*/
		

	}
	


}