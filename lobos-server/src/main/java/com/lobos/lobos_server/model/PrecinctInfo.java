package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "precinct-info")
public class PrecinctInfo {
    @Id
    private String id;
    private String state;
    private Map<String, Object>[] precincts;

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

    public Map<String, Object>[] getPrecincts() {
        return precincts;
    }

    public void setPrecincts(Map<String, Object>[] precincts) {
        this.precincts = precincts;
    }
}
