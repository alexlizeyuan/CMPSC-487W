module project1.sunlabsystem {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires com.dlsc.formsfx;
    requires java.sql;

    opens project1.sunlabsystem to javafx.fxml;
    exports project1.sunlabsystem;
}