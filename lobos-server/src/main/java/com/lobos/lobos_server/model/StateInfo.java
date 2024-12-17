package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state-info")
public class StateInfo {
    @Id
    private String id;
    private String state;
    private StateData data;

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

    public StateData getData() {
        return data;
    }

    public void setData(StateData data) {
        this.data = data;
    }
}