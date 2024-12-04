package com.lobos.lobos_server.model;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "precinct-info")
public class PrecinctInfo {
    @Id
    private String id;
    private String state;  // State name (e.g., "Utah", "South Carolina")
    private List<Map<String, Object>> precincts;  // List of precinct-level data

    // Getters and setters
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

    public List<Map<String, Object>> getPrecincts() {
        return precincts;
    }

    public void setPrecincts(List<Map<String, Object>> precincts) {
        this.precincts = precincts;
    }
}
