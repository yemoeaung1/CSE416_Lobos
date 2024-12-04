package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

//Add a specific dataset for a specific state
@Document
public class DataSet {
    private String label; // Name of the data set (e.g., "Democrat", "Republican")
    private List<Integer> data; // Data values for the corresponding labels
    private String backgroundColor; // Background color of the bar
    private String borderColor; // Border color of the bar
    private int borderWidth; // Border width of the bar

    // Getters and Setters
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
    
    //Getters and Setters for Data
    public List<Integer> getData() {
        return data;
    }

    public void setData(List<Integer> data) {
        this.data = data;
    }

    //Getters and Setters for BackGroundColor
    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    //Getters and Setters for Border Color
    public String getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        this.borderColor = borderColor;
    }

    //Getters and Setters for BorderWidth
    public int getBorderWidth() {
        return borderWidth;
    }

    public void setBorderWidth(int borderWidth) {
        this.borderWidth = borderWidth;
    }
}
