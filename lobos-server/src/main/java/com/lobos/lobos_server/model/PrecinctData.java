package com.lobos.lobos_server.model;

import org.springframework.data.mongodb.core.mapping.Field;

public class PrecinctData {
    private String GEOID;
    private String name;

    private int hispanic;
    private int white;
    private int black;
    private int asian;
    private int non_hispanic;

    @Field("LESS_10K")
    private int income0K;
    @Field("10K_15K")
    private int income10K;
    @Field("15K_20K")
    private int income15K;
    @Field("20K_25K")
    private int income20K;
    @Field("25K_30K")
    private int income25K;
    @Field("30K_35K")
    private int income30K;
    @Field("35K_40K")
    private int income35K;
    @Field("40K_45K")
    private int income40K;
    @Field("45K_50K")
    private int income45K;
    @Field("50K_60K")
    private int income50K;
    @Field("60K_75K")
    private int income60K;
    @Field("75K_100K")
    private int income75K;
    @Field("100K_125K")
    private int income100K;
    @Field("125K_150K")
    private int income125K;
    @Field("150K_200K")
    private int income150K;
    @Field("200K_MORE")
    private int income200K;

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
    @Field("2020_PRES_R")
    private int PRES_R;
    @Field("2020_PRES_D")
    private int PRES_D;
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

    public int getNonHispanic(){
        return non_hispanic;
    }

    public int getHispanic(){
        return hispanic;
    }

    public int getWhite(){
        return white;
    }

    public int getBlack(){
        return black;
    }

    public int getAsian(){
        return asian;
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

    public int getPresR(){
        return PRES_R;
    }

    public int getPresD(){
        return PRES_D;
    }
    
    public String getMajorityParty(){
        return majority_party;
    }
}
