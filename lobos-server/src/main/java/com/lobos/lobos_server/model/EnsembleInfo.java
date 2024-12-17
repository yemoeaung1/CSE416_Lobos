package com.lobos.lobos_server.model;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ensemble-info")
public class EnsembleInfo {
    @Id
    private String id;
    private String state;
    private int num_plans;
    private Map<String, Integer> splits;
    private Map<String, Map<String, Boxplot>> boxplot;

    @Field("district_winner_tally")
    private Map<String, List<Integer>> districtWinnerTally;

    public String getId() {
        return id;
    }
    
    public String getState() {
        return state;
    }

    public int getNumPlans(){
        return num_plans;
    }

    public Map<String, Integer> getSplits(){
        return splits;
    }

    public Map<String, Map<String, Boxplot>> getBoxplot() {
        return boxplot;
    }

    public Map<String, List<Integer>>  getDistrictWinnerTally() {
        return districtWinnerTally;
    }
}
