package project1.sunlabsystem;

public class UserInfo {
    private String username;
    private String status;

    public UserInfo(String username, String status) {
        this.username = username;
        this.status = status;
    }

    public String getUsername() {
        return username;
    }

    public String getStatus() {
        return status;
    }
}
