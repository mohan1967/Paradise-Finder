package login;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;


/**
 * Servlet implementation class DataController
 */
public class DataController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static String  API_KEY = "AIzaSyCabY3IHKk5BpGgiUHuJumC-jLThblTWHQ";
       


	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	
	public static boolean isValid(Object value) {
		return value != null && !value.equals("null") && !value.equals("");
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		String location = request.getParameter("location");
		String zipCode = null;
		if(!isValid(location)) {
			String obj=(String)request.getSession().getAttribute("userinfo");

			JSONObject userInfo = new JSONObject(obj);
			JSONObject temp =  (JSONObject) userInfo.opt("positions");
			JSONArray arr = (JSONArray)temp.opt("values");
			String loc = (String) ((JSONObject)((JSONObject)arr.get(0)).opt("location")).opt("name");
			location = loc.split(",")[0];

		}
		if(isValid(location)) {
			if(!isValid(zipCode)) {
				location = location.replaceAll(" ", "%20");
				String responseobj=getUrlObj("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+location+"%20zipcode&key=AIzaSyCabY3IHKk5BpGgiUHuJumC-jLThblTWHQ",null,null,"GET");
				JSONObject mapsData = new JSONObject(responseobj);
				JSONArray temp = (JSONArray) mapsData.opt("results");
				JSONObject entry1 = (JSONObject) temp.opt(0);
				String address = entry1.optString("formatted_address");
				zipCode = address.split(",")[2].split(" ")[2];
			}
		}
		JSONObject result = null;

		try {
			JSONArray jsonArray = LoadOntology.getApartmentInfo(zipCode);
			request.getSession().setAttribute("details", jsonArray);
			response.getWriter().print(jsonArray.toString());


		} catch (JSONException e) {
			// TODO Auto-generated catch block
			response.getWriter().print(result);
			e.printStackTrace();
		}
		
	}
	
	
    public static String getUrlObj(String address,String header,String verifier,String method) throws IOException{
    	HttpURLConnection connection = null;
    try {
        
        URL url = new URL(address);
        connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setRequestMethod(method);
        connection.setRequestProperty("Host", "api.linkedin.com");
        connection.setRequestProperty("User-Agent", "oauthApplication");
        connection.setRequestProperty("Authorization", "OAuth "+header);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        connection.setUseCaches(false);
        if(verifier!=null)
        {
        	OutputStreamWriter output = new OutputStreamWriter(connection.getOutputStream());
    		output.write("oauth_verifier="+verifier);
    		output.close();
        }
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

    public static String readResponse(HttpURLConnection connection) {
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


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
