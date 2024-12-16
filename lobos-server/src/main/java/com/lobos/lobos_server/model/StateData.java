package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Field;

public class StateData {
    @Field("Vote Distribution")
    private Map<String, Object> voteDist;

    @Field("Race Distribution")
    private Map<String, Object> raceDist;

    @Field("Income Distribution")
    private Map<String, Object> incomeDist;

    @Field("Region Type Distribution")
    private Map<String, Object> regionTypeDist;

    @Field("Political Party")
    private String party;

    @Field("Total Population")
    private int population;

    @Field("Median Household Income")
    private int median_income;

    @Field("Poverty Rate")
    private double poverty_rate;

    @Field("Source")
    private String source;

    @Field("Redistricting Party")
    private String redistricting_party;

    @Field("Total Districts")
    private int total_districts;

    @Field("Total Precincts")
    private int total_precincts;

    @Field("Population Density (Sq Mi)")
    private double population_density_mi;

    @Field("Population Density (Sq Km)")
    private double population_density_km;

    public Map<String, Object> getVoteDistribution(){
        return voteDist;
    }

    public Map<String, Object> getRaceDistribution(){
        return raceDist;
    }

    public Map<String, Object> getIncomeDist(){
        return incomeDist;
    }

    public Map<String, Object> getRegionTypeDist(){
        return regionTypeDist;
    }

    public String getParty(){
        return party;
    }

    public int getTotalPopulation(){
        return population;
    }

    public double getMedianIncome(){
        return median_income;
    }

    public double getPovertyRate(){
        return poverty_rate;
    }
    
    public String getSource(){
        return source;
    }

    public String getRedistrictingParty(){
        return redistricting_party;
    }

    public int getTotalDistricts(){
        return total_districts;
    }

    public int getTotalPrecincts(){
        return total_precincts;
    }

    public double getDensityMi(){
        return population_density_mi;
    }

    public double getDensityKm(){
        return population_density_km;
    }
}
