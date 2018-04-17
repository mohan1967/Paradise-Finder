package login;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;
import org.apache.jena.rdf.model.RDFNode;
import org.json.JSONArray;
import org.json.JSONObject;

public class LoadOntology {
	
	static String serviceEndPoint = "http://localhost:3030/zillow/query";

	public static JSONArray getApartmentInfo(String zip) throws IOException {
		// TODO Auto-generated method stub
		String strQuery = "PREFIX apartment: <http://www.semanticweb.org/anusha/ontologies/2017/9/untitled-ontology-18#> "
				+ " SELECT DISTINCT ?z_address ?zipcode ?bedroom ?bathroom ?year ?area ?latitude ?longitude ?details WHERE{"+
  		  " ?subject apartment:ApartmentAddress ?z_address;"+
          " apartment:HasZipcode ?zipcode;"+
          " apartment:HasBedroom ?bedroom;"+
          " apartment:HasBathroom ?bathroom;"+
          " apartment:WasBuilt ?year;"+
          " apartment:HasArea ?area;"+
          " apartment:Latitude ?latitude;"+
          " apartment:Longitude ?longitude;"+
          " apartment:HasDetails ?details"+
 
     " FILTER(?zipcode=\""+zip+"\") }";
		LoadOntology lo = new LoadOntology();
		return lo.loadHumanClasses(serviceEndPoint, strQuery);
	}
	
	private JSONArray loadHumanClasses(String serviceURI, String query) throws IOException {
		QueryExecution q = QueryExecutionFactory.sparqlService(serviceURI, query);
		ResultSet results = q.execSelect();
		JSONArray jArray = new JSONArray();
		while(results.hasNext()) {
			JSONObject result = new JSONObject();
			QuerySolution sol = results.next();
			RDFNode lon = sol.get("longitude");
			RDFNode lat = sol.get("latitude");
			RDFNode link = sol.get("details");
			RDFNode area = sol.get("area");
			RDFNode year = sol.get("year");
			RDFNode bath = sol.get("bathroom");
			RDFNode bed = sol.get("bedroom");
			RDFNode add = sol.get("z_address");

			result.put("longitude", lon.toString());
			result.put("latitude", lat.toString());
			result.put("homedetails", link.toString());
			result.put("finishedSqFt", area.toString());
			result.put("address", add.toString());
			result.put("bathrooms", bath.toString());
			result.put("yearBuilt", year.toString().equals("0") ? "NA": year.toString());
			int finishedSqFt = Integer.parseInt(area.toString());
			result.put("finishedSqFt", finishedSqFt == 0?  "NA": finishedSqFt );
			if(bed.toString().equals("NaN")) {
				result.put("bedrooms", "NA");
			}else {
				result.put("bedrooms", bed.toString());
			}
			if(bath.toString().equals("NaN")) {
				result.put("bathrooms", "NA");
			}else {
				result.put("bathrooms", bath.toString());
			}
			String walkScore=DataController.getUrlObj("http://api.walkscore.com/score?format=json&transit=1&bike=1&wsapikey=cb704c0c5a54ed7cdd8ee5e9e1cd0d92&lat="+lat.toString()+"&lon="+lon.toString(),null, null, "GET");
			JSONObject jsonObj = new JSONObject(walkScore);
			JSONObject transit = new JSONObject(jsonObj.optString("transit"));
			JSONObject bike = new JSONObject(jsonObj.optString("bike"));
			StringBuilder score = new StringBuilder();
			score.append("Walk: "+jsonObj.optString("walkscore"));
			score.append(" Bike: "+ bike.optString("score"));
			score.append(" Transit: "+ transit.optString("score"));
			result.put("score", score.toString());
			StringBuilder comments = new StringBuilder();
			comments.append(jsonObj.optString("description"));
			comments.append(", "+ bike.optString("description"));
			comments.append(" & "+ transit.optString("description"));
			result.put("comments", comments.toString());

			jArray.put(result);
		}
		return jArray;
	}

}
