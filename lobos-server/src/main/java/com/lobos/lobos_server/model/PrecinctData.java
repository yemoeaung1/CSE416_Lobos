package com.lobos.lobos_server.model;

import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Field;

public class PrecinctData {
    private String GEOID;
    private String name;

    @Field("Vote Distribution")
    private Map<String, Object> voteDist;

    @Field("Race Distribution")
    private Map<String, Object> raceDist;

    @Field("Income Distribution")
    private Map<String, Object> incomeDist;

    private int total_population;
    private int total_households;
    private int households_below_poverty_line;
    private double median_income;
    private double poverty_rate;
    @Field("land_area(m2)")
    private long land_area;
    private String region_type;
    private String[] neighbors;
    private int district;

    private String incumbent;
    private String majority_party;

    public String getGEOID(){
        return GEOID;
    }

    public int getTotalPopulation(){
        return total_population;
    }

    public int getTotalHouseholds(){
        return total_households;
    }

    public int getHouseholdsBelowPovertyLine(){
        return households_below_poverty_line;
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

    public double getMedianIncome(){
        return median_income;
    }

    public double getPovertyRate(){
        return poverty_rate;
    }
    
    public String getName(){
        return name;
    }

    public long getLandArea(){
        return land_area;
    }

    public String getRegionType(){
        return region_type;
    }

    public String[] getNeighbors(){
        return neighbors;
    }

    public int getDistrict(){
        return district;
    }

    public String getIncumbent(){
        return incumbent;
    }
    
    public String getMajorityParty(){
        return majority_party;
    }
}
