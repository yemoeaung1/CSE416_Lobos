package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state-map-config")
public class StateMapConfig {
    @Id
    private String id;
    private String state;
    private double[] center;
    private double[][] bounds;
    private int minZoom;
    private int maxZoom;
    private int currZoom;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public double[] getCenter() {
        return center;
    }

    public void setCenter(double[] center) {
        this.center = center;
    }

    public double[][] getBounds() {
        return bounds;
    }

    public void setBounds(double bounds[][]) {
        this.bounds = bounds;
    }

    public int getMinZoom() {
        return minZoom;
    }

    public void setMinZoom(int minZoom) {
        this.minZoom = minZoom;
    }

    public int getMaxZoom() {
        return maxZoom;
    }

    public void setMaxZoom(int maxZoom) {
        this.maxZoom = maxZoom;
    }

    public int getCurrZoom() {
        return currZoom;
    }

    public void setCurrZoom(int currZoom) {
        this.currZoom = currZoom;
    }
}
