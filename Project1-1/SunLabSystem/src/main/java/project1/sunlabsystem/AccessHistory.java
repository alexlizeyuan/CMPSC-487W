package project1.sunlabsystem;

import java.sql.Timestamp;

public class AccessHistory {
    private String username;
    private String timestamp;


    public AccessHistory(String username, String timestamp) {
        this.username = username;
        this.timestamp = timestamp;
    }

    public String getUsername() {
        return username;
    }

    public String getTimestamp() {
        return timestamp;
    }
}
