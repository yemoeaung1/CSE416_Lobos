package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "ecological-inference-info")
public class EcologicalInferenceInfo {
    @Id
    private String id;
    private String state;

    private Map<String, Map<String, Map<String, Object>>> ecological_inference;

    // Getters and Setters
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

    public Map<String, Map<String, Map<String, Object>>> getEcologicalInference() {
        return ecological_inference;
    }

    public void setEcologicalInference(Map<String, Map<String, Map<String, Object>>> ecological_inference) {
        this.ecological_inference = ecological_inference;
    }
}