package com.lobos.lobos_server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ensemble-info")
public class EnsembleInfo {
    @Id
    private String id;
    private String state;
    private int num_plans;
    private Map<String, Integer> splits;
    // private BoxplotGroup boxplot; // Updated type for the nested boxplot structure
    private Map<String, Map<String, Boxplot>> boxplot;
    
    // @Field("boxplot")
    // private Groups groups;

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

    public int getNumPlans(){
        return num_plans;
    }

    public Map<String, Integer> getSplits(){
        return splits;
    }

    // public BoxplotGroup getBoxplot() {
    //     return boxplot;
    // }
    public Map<String, Map<String, Boxplot>> getBoxplot() {
        return boxplot;
    }
}
