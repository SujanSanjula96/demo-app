import ballerina/http;

public type Status record {
    string status;
};

public type Name record {
    string name;
};

public type Issue record {
    string id;
    string name;
    string status;
};

map<Issue> issues = {};
int id_count= 0;

# A service representing a network-accessible API
# bound to port `9090`.
service / on new http:Listener(9090) {

    resource function get issues() returns Issue[]|error {
        string[] issueList = issues.keys();
        Issue[] response = [];

        foreach var issue in issueList {
            response.push(issues.get(issue));
        }
        return response;
    }

    resource function post issues(@http:Payload Name payload) returns Issue|error {
        Issue issue= {
            id: id_count.toBalString(),
            name: payload.name,
            status: "Open"
        };

        issues[id_count.toBalString()] = issue;
        id_count += 1;

        return issue;
    }

    resource function patch issues/[string issueId](@http:Payload Status payload) returns Issue|error {
        string currentIssue =  issues.get(issueId).name;
        Issue issue = {
            id: issueId,
            name: currentIssue,
            status: payload.status
        };

        issues[issueId] = issue;

        return issue;
    }
}
