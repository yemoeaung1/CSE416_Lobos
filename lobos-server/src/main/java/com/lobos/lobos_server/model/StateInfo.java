package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "state-info")
public class StateInfo {
    @Id
    private String id;
    private String state;
    private Map<String, Object> data;
    private Map<String, Object> tableSettings;

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

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public Map<String, Object> getTableSettings() {
        return tableSettings;
    }

    public void setTableSettings(Map<String, Object> tableSettings) {
        this.tableSettings = tableSettings;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/test-cody
