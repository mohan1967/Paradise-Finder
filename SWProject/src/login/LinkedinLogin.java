package login;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



/** * Servlet implementation class LoginServlet */ 
public class LinkedinLogin extends HttpServlet {
	 
    private final static String getOAuthorizeURL = "https://www.linkedin.com/uas/oauth2/authorization";
    private static String bearerToken;
    public static final String callback="http://localhost:8080/SWProject/linkedin/redirect";
    public static final String CONSUMER_KEY = "75o41ybcp3px8q";
    public static final String CONSUMER_SECRET= "KLp1oISaQodfY47u";
   // static String secretcode;
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException { 
		  HashMap<String,String> bearer=new HashMap<String,String>();
		  String oauthProviderUrl = getOAuthorizeURL;
		  	oauthProviderUrl += "?response_type=code" + "&client_id=" + CONSUMER_KEY; //No I18N
			oauthProviderUrl += "&scope=r_basicprofile"; //No I18N
			oauthProviderUrl += "&redirect_uri=" +callback; //No I18N
			oauthProviderUrl += "&state=" + "FDJKNVER9GEH49IUG34OGIU435NG4I5N4RINERF985HT43INOIRGNFOIJNV94E5"; //No I18N
 //https://graph.facebook.com/v2.10/me?fields=id,name,picture,email,timezone,age_range&access_token=EAAXobVlJSKMBADwK6Rl6dkF3iCYbVI6eOtN3IM329wAXurFRSGwSvSDwad51RSqYYendZCV71Kjeq3zmZBAjTRhAV9NxXNk1GztEZAALRX3j2rswWHGusD8ZAj9AeKX0Up5pAZBMzqvAT4Nk0E9ZCBVWabS3ZAnxlqzMgcXgI2WrgZDZD
		  response.sendRedirect(oauthProviderUrl);
	              
	}
	     
	        

	    

	    public static String getNonce(){
	        char[] chars = "0123456789abcdefghijklmnopqrstuvwxyz".toCharArray();
	        StringBuilder sb = new StringBuilder();
	        Random random = new Random();
	        for (int i = 0; i < 32; i++) {
	            char c = chars[random.nextInt(chars.length)];
	            sb.append(c);
	        }
	        String nonce = sb.toString();

	        return nonce;
	    }


	    public static String getTimestamp(){
	        long time = System.currentTimeMillis();
	        return String.valueOf(time/1000);
	    }
	    
	    
 public static String getUrlObj(String address,String method) throws IOException{
	        	HttpsURLConnection connection = null;
	        try {
	            
	            URL url = new URL(address);
	            connection = (HttpsURLConnection) url.openConnection();
	            connection.setDoOutput(true);
	            connection.setDoInput(true);
	            connection.setRequestMethod(method);
	            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	            connection.setUseCaches(false);
	            String response = readResponse(connection);
	            return response;
	        } catch (MalformedURLException e) {
	            throw new IOException("Invalid endpoint URL specified.", e);
	        } finally {
	            if (connection != null) {
	                connection.disconnect();
	            }
	        }
	     
	    }
	    
	    private static String readResponse(HttpURLConnection connection) {
	        try {
	            StringBuilder str = new StringBuilder();

	            BufferedReader br = new BufferedReader(new InputStreamReader(
	                    connection.getInputStream()));
	            String line = "";
	            while ((line = br.readLine()) != null) {
	                str.append(line + System.getProperty("line.separator"));
	            }
	            return str.toString();
	        } catch (IOException e) {
	            return new String(e.getMessage());
	        }
	    }

}