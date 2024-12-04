package com.lobos.lobos_server.model;

import org.springframework.data.mongodb.core.mapping.Field;

public class PrecinctData {
    private String GEOID20;
    private int total_population;
    private int total_households;
    private int households_below_poverty_line;
    private int non_hispanic;
    private int hispanic;
    private int white;
    private int black;
    private int american_indian;
    private int asian;
    private int hawaiian_pacific_islander;
    private int other;
    private int two_or_more;
    private int median_income;
    private double percent_households_living_below_poverty_line;
    private String name;
    @Field("land_area(m2)")
    private long land_area;
    private String region_type;
    private String[] neighbors;
    private int district;
    @Field("2020_PRES_R")
    private int PRES_R;
    @Field("2020_PRES_D")
    private int PRES_D;
    private String majority_party;

    public String getGEOID(){
        return GEOID20;
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

    public int getAmericanIndian(){
        return american_indian;
    }

    public int getAsian(){
        return asian;
    }

    public int getHawaiianPacificIslander(){
        return hawaiian_pacific_islander;
    }

    public int getOther(){
        return other;
    }

    public int getTwoOrMore(){
        return two_or_more;
    }

    public int getMedianIncome(){
        return median_income;
    }

    public double getPercentHouseholdsLivingBelowPovertyLine(){
        return percent_households_living_below_poverty_line;
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
