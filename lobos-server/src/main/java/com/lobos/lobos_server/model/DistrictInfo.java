package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "district-info")
public class DistrictInfo {
    @Id
    private String id;
    private String state;
    private Object[] data;
    private Map<String, Object> representativeData;

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

    public Object[] getData() {
        return data;
    }

    public void setData(Object[] data) {
        this.data = data;
    }

    public Map<String, Object> getRepresentativeData() {
        return representativeData;
    }

    public void setRepresentativeData(Map<String, Object> representativeData) {
        this.representativeData = representativeData;
    }
}
