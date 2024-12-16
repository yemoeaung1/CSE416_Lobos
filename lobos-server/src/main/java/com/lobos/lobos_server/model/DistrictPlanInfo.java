package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.lobos.lobos_server.utilities.GeoJSON;

@Document(collection = "district-plans")
public class DistrictPlanInfo {
    @Id
    private String id;
    private String state;
    private String name;
    private DistrictData[] data;
    private GeoJSON geoJSON;
    private Map<String, Object> properties;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public DistrictData[] getData() {
        return data;
    }

    public void setDistricts(DistrictData[] data) {
        this.data = data;
    }

    public GeoJSON getGeoJSON() {
        return geoJSON;
    }

    public void setGeoJSON(GeoJSON geoJSON) {
        this.geoJSON = geoJSON;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setRepresentativeData(Map<String, Object> properties) {
        this.properties = properties;
    }
}
