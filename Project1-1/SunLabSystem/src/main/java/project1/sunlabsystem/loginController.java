package project1.sunlabsystem;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;


public class loginController {

    @FXML
    private TextField usernameTextfield;
    @FXML
    private TextField passwordTextfield;
    @FXML
    private Label loginStatusLabel;
    public void swipeButton(ActionEvent event){
        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();


        String username = usernameTextfield.getText();
        String databaseUsername = "";
        String databaseUserStatus = "";
        Date date = new java.util.Date();
        Timestamp timestamp = new Timestamp(date.getTime());


        try {
            PreparedStatement checkStatement = connectionDB.prepareStatement("select * from user where username = ?");
            checkStatement.setString(1, username);
            ResultSet resultSet = checkStatement.executeQuery();

            while(resultSet.next()){
//                System.out.println(resultSet.getString(1));
//                System.out.println(resultSet.getString(2));
//                System.out.println(resultSet.getString(3));
                databaseUsername = resultSet.getString(1);
                databaseUserStatus = resultSet.getString(3);
            }

            if (!databaseUsername.isEmpty() && !databaseUserStatus.equals("Suspended")){
                PreparedStatement loggingStatement = connectionDB.prepareStatement("Insert into history(username, timestamp) values (?,?)");
                loggingStatement.setString(1, username);
                loggingStatement.setTimestamp(2, timestamp);
    
                int status = loggingStatement.executeUpdate();
    
                if (status == 1){
                    loginStatusLabel.setText("Swipe in successful!");
                } else{
                    loginStatusLabel.setText("Error during swipe, Try again!");
                }
            } else if (databaseUsername.isEmpty()) {
                loginStatusLabel.setText("No user information found!");
            } else if (databaseUserStatus.equals("Suspended")) {
                loginStatusLabel.setText("Access revoked, please contact admin!");
            }

        } catch (Exception e){
            e.printStackTrace();
        }

    }
    public void loginButton(ActionEvent event){
        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        String username = usernameTextfield.getText();
        String password = passwordTextfield.getText();

        String databaseUsername = "";
        String databaseUserpassword = "";
        String databaseUserStatus = "";

        Date date = new java.util.Date();
        Timestamp timestamp = new Timestamp(date.getTime());

        try {
            PreparedStatement checkStatement = connectionDB.prepareStatement("select * from user where username = ?");
            checkStatement.setString(1, username);
            ResultSet resultSet = checkStatement.executeQuery();

            while(resultSet.next()){
                databaseUsername = resultSet.getString(1);
                databaseUserpassword = resultSet.getString(2);
                databaseUserStatus = resultSet.getString(3);
            }

            if (databaseUsername.isEmpty() || !databaseUserpassword.equals(password)){
                loginStatusLabel.setText("Incorrect login information");
            } else if (!databaseUserStatus.equals("Admin")) {
                loginStatusLabel.setText("Insufficient privilege");
            } else {
                PreparedStatement loggingStatement = connectionDB.prepareStatement("Insert into history(username, timestamp) values (?,?)");
                loggingStatement.setString(1, username);
                loggingStatement.setTimestamp(2, timestamp);

                int status = loggingStatement.executeUpdate();

                if (status == 1){
                    loginStatusLabel.setText("Login Successful! Welcome back admin");


                    HelloApplication.changeScene("adminPage.fxml");
                } else{
                    loginStatusLabel.setText("Error during log in, Try again!");
                }

            }

        } catch (Exception e){
            e.printStackTrace();
        }

    }
}
