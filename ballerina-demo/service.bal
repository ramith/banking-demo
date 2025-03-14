import ballerina/http;
import ballerina/log;
import ballerina/xmldata;


configurable string backendUrl = ?;

service / on new http:Listener(8080) {

    resource function get customer/[string customerId]() returns json|error {
        // Create a new HTTP client
        http:Client clientEndpoint = check new (backendUrl);

        // Invoke backend service that returns XML
        xml xmlResponse = check clientEndpoint->get(string `/` + customerId);
        log:printInfo(string `Fetched XML from backend : ${xmlResponse.toString()}`);
        // Convert XML response to JSON
        json jsonResponse = check xmldata:toJson(xmlResponse);

        log:printInfo("Fetched XML from backend and converted to JSON");

        // Return JSON response
        return jsonResponse;
    }
}
