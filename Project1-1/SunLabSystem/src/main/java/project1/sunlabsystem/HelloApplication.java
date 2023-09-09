package project1.sunlabsystem;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.Objects;

public class HelloApplication extends Application {
    private static Stage primaryStage;

    @Override
    public void start(Stage stage) throws IOException {
        primaryStage = stage;
        FXMLLoader loginPageFXMLLoader = new FXMLLoader(HelloApplication.class.getResource("loginPage.fxml"));
        Scene loginScene = new Scene(loginPageFXMLLoader.load(), 600, 320);
        stage.setTitle("Sunlab System");
        stage.setScene(loginScene);
        stage.show();
    }

    public static void  changeScene(String fxml) throws IOException {
        FXMLLoader adminPageFXMLLoader = new FXMLLoader(HelloApplication.class.getResource("adminPage.fxml"));
        Scene adminScene = new Scene(adminPageFXMLLoader.load(), 660, 575);
        primaryStage.setScene(adminScene);
    }

    public static void main(String[] args) {
        launch();
    }
}