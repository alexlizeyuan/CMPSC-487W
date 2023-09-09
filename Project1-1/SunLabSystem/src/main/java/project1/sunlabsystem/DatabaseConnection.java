package project1.sunlabsystem;
import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {
    public Connection databaseLink;
    public Connection getConnection(){
        String databaseName = "sunlabsystem";
        String databaseUser = "root";
        String databasePassword = "a1234554321";
        String url = "jdbc:mysql://localhost:3306/" + databaseName;

        try{
            Class.forName("com.mysql.cj.jdbc.Driver");
            databaseLink = DriverManager.getConnection(url, databaseUser, databasePassword);


        }catch (Exception e){
            System.out.println(e);
        }
        return databaseLink;
    }
}
