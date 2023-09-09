package project1.sunlabsystem;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;

import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.ResourceBundle;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

public class AdminController implements Initializable {

    @FXML
    private TableView<AccessHistory> historyTable;

    @FXML
    private TableColumn<AccessHistory, String> historyTimestamp;

    @FXML
    private TableColumn<AccessHistory, String> historyUser;

    @FXML
    private TextField usernameInput;
    @FXML
    private DatePicker dateInput;
    @FXML
    private ChoiceBox<String> userStatus;
    private String[] userStatusChoice = {"Student", "Admin", "Suspended"};

    @FXML
    private TableView<UserInfo> userTable;
    @FXML
    private TableColumn<UserInfo, String> userTableUsername;
    @FXML
    private TableColumn<UserInfo, String> userTableStatus;
    @FXML
    private TextField usernameAdding;
    @FXML
    private Label updateStatus;


    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        historyTimestamp.setCellValueFactory(new PropertyValueFactory<AccessHistory, String>("timestamp"));
        historyUser.setCellValueFactory(new PropertyValueFactory<AccessHistory, String>("username"));

        userTableUsername.setCellValueFactory(new PropertyValueFactory<UserInfo, String>("username"));
        userTableStatus.setCellValueFactory(new PropertyValueFactory<UserInfo, String>("status"));

        userStatus.getItems().addAll(userStatusChoice);

        obtainHistory();
        obtainUser();
    }

    public void obtainHistory (){
        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        ObservableList<AccessHistory> historyList = FXCollections.observableArrayList();

        try {
            PreparedStatement checkStatement = connectionDB.prepareStatement("select * from history");
            ResultSet resultSet = checkStatement.executeQuery();

            while (resultSet.next()) {
                historyList.add(new AccessHistory(resultSet.getString(1), resultSet.getTimestamp(2).toString()));
            }
            historyTable.setItems(historyList);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public void obtainHistoryByCondition(ActionEvent e){
        LocalDate searchDate = dateInput.getValue();
        String searchUsername = usernameInput.getText();


        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        ObservableList<AccessHistory> historyList = FXCollections.observableArrayList();

        try {
            PreparedStatement checkStatement;
            if (!searchUsername.isEmpty() && searchDate != null){
                System.out.println("have both");
                checkStatement = connectionDB.prepareStatement("select * from history where username = ? and timestamp >= ? and timestamp < ? ");
                checkStatement.setString(1, searchUsername.toString());
                checkStatement.setString(2, searchDate.toString());
                checkStatement.setString(3, searchDate.plusDays(1).toString());

            } else if (!searchUsername.isEmpty()) {
                System.out.println("have username, no date");
                checkStatement = connectionDB.prepareStatement("select * from history where username = ?");
                checkStatement.setString(1, searchUsername.toString());

            } else if (searchDate != null){
                System.out.println("have date, no username");
                checkStatement = connectionDB.prepareStatement("select * from history where timestamp >= ? and timestamp < ?");
                checkStatement.setString(1, searchDate.toString());
                checkStatement.setString(2, searchDate.plusDays(1).toString());

            } else{
                System.out.println("have nothing");
                checkStatement = connectionDB.prepareStatement("select * from history");
            }



            ResultSet resultSet = checkStatement.executeQuery();

            while (resultSet.next()) {

                historyList.add(new AccessHistory(resultSet.getString(1), resultSet.getTimestamp(2).toString()));
            }
            historyTable.setItems(historyList);
        } catch (Exception exception){
            exception.printStackTrace();
        }
    }

    public void obtainUser (){
        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        ObservableList<UserInfo> userList = FXCollections.observableArrayList();

        try {
            PreparedStatement checkStatement = connectionDB.prepareStatement("select * from user");
            ResultSet resultSet = checkStatement.executeQuery();

            while (resultSet.next()) {
                userList.add(new UserInfo(resultSet.getString(1), resultSet.getString(3)));
            }
            userTable.setItems(userList);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public void addUser(ActionEvent e){
        String statusChoice = userStatus.getValue();
        String username = usernameAdding.getText();

        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        try {
            if (username != null && statusChoice != null){
                PreparedStatement checkStatement = connectionDB.prepareStatement("insert into user (username, status) values (?,?)");
                checkStatement.setString(1,username);
                checkStatement.setString(2,statusChoice);
                int result = checkStatement.executeUpdate();
                if (result == 1){
                    updateStatus.setText("Success");
                    obtainUser();
                } else{
                    updateStatus.setText("Failed");
                }
            }

        } catch (Exception exception){
            updateStatus.setText(exception.getLocalizedMessage());
            exception.printStackTrace();
        }
    }

    public void deleteUser(ActionEvent e){
        UserInfo selectedPerson = userTable.getSelectionModel().getSelectedItem();

        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        try{
            String username = selectedPerson.getUsername();

            PreparedStatement checkStatement = connectionDB.prepareStatement("delete from user where username = ?");
            checkStatement.setString(1,username);
            int result = checkStatement.executeUpdate();
            if (result == 1){
                updateStatus.setText("Success");
                obtainUser();
            } else{
                updateStatus.setText("Failed");
            }

        } catch (Exception exception){
            if (exception.getLocalizedMessage().equals("Cannot invoke \"project1.sunlabsystem.UserInfo.getUsername()\" because \"selectedPerson\" is null")){
                updateStatus.setText("No user selected");
            } else{
                exception.printStackTrace();
            }

        }

    }

    public void updateUser(ActionEvent e){
        UserInfo selectedPerson = userTable.getSelectionModel().getSelectedItem();

        DatabaseConnection connectNow = new DatabaseConnection();
        Connection connectionDB = connectNow.getConnection();

        try{
            String username = selectedPerson.getUsername();
            String statusChoice = userStatus.getValue();

            PreparedStatement checkStatement = connectionDB.prepareStatement("update user set status = ? where username = ?");
            checkStatement.setString(1,statusChoice);
            checkStatement.setString(2,username);
            int result = checkStatement.executeUpdate();
            if (result == 1){
                updateStatus.setText("Success");
                obtainUser();
            } else{
                updateStatus.setText("Failed");
            }


        } catch (Exception exception){
            System.out.println(exception.getLocalizedMessage());
            if (exception.getLocalizedMessage().equals("Cannot invoke \"project1.sunlabsystem.UserInfo.getUsername()\" because \"selectedPerson\" is null")){
                updateStatus.setText("No user selected");
            } else if (exception.getLocalizedMessage().equals("Column 'status' cannot be null")){
                updateStatus.setText("No status selected");
            }else {
                exception.printStackTrace();
            }

        }
    }
}

