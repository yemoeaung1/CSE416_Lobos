package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Field;

public class DistrictData {
    private String name;
    private int total_population;

    @Field("Vote Distribution")
    private Map<String, Object> voteDist;

    @Field("Race Distribution")
    private Map<String, Object> raceDist;

    @Field("Income Distribution")
    private Map<String, Object> incomeDist;

    
    public String getName(){
        return name;
    }

    public int getTotalPopulation(){
        return total_population;
    }

    public Map<String, Object> getVoteDistribution(){
        return voteDist;
    }

    public Map<String, Object> getRaceDistribution(){
        return raceDist;
    }

    public Map<String, Object> getIncomeDist(){
        return incomeDist;
    }
}

