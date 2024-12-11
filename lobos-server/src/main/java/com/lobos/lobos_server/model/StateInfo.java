package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state-info")
public class StateInfo {
    @Id
    private String id;
    private String state;
    private Map<String, Object> stateData;
    private Map<String, Object> districtData;

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

    public Map<String, Object> getStateData() {
        return stateData;
    }

    public void setStateData(Map<String, Object> stateData) {
        this.stateData = stateData;
    }

    public Map<String, Object> getDistrictData() {
        return districtData;
    }

    public void setDistrictData(Map<String, Object> districtData) {
        this.districtData = districtData;
    }
}