package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.lobos.lobos_server.utilities.GeoJSON;

@Document(collection = "state-map")
public class StateMap {
    @Id
    private String id;
    private String state;
    private String view;
    private GeoJSON geoJSON;

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

    public GeoJSON getGeoJSON() {
        return geoJSON;
    }

    public void setGeoJSON(GeoJSON geoJSON) {
        this.geoJSON = geoJSON;
    }
}
