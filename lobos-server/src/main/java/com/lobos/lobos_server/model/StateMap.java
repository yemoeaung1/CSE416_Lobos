package com.lobos.lobos_server.model;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state-map")
public class StateMap {
    @Id
    private String id;
    private String state;
    private String view;
    private Map<String, Object> geoJSON;

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

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public Map<String, Object> getGeoJSON() {
        return geoJSON;
    }

    public void setGeoJSON(Map<String, Object> geoJSON) {
        this.geoJSON = geoJSON;
    }
}
