package com.lobos.lobos_server.utilities;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lobos.lobos_server.enum_classes.MapFiltersEnum;
import com.lobos.lobos_server.enum_classes.RegionTypeEnum;
import com.lobos.lobos_server.model.PrecinctData;

public class HeatmapMethods {

    public static ColorMapping defaultColorMapping = new ColorMapping("#FFFFFF", 0.8);

    public static Map<String, ColorMapping> demoBins;
    public static Map<String, ColorMapping> ecoBins;
    public static Map<String, ColorMapping> povertyBins;
    public static Map<String, ColorMapping> regionBins;
    public static Map<String, ColorMapping> ecoPolBins;

    static {
        demoBins = new HashMap<>();
        demoBins.put("KEY", new ColorMapping("#FFFFFF", 0.8));

        ecoBins = new HashMap<>();
        ecoBins.put("$0K-$15K", new ColorMapping("hsl(140 40% 85%)", 0.6));
        ecoBins.put("$15K-$25K", new ColorMapping("hsl(140 50% 75%)", 0.6));
        ecoBins.put("$25K-$35K", new ColorMapping("hsl(140 60% 65%)", 0.6));
        ecoBins.put("$35K-$50K", new ColorMapping("hsl(135 70% 60%)", 0.7));
        ecoBins.put("$50K-$75K", new ColorMapping("hsl(135 70% 50%)", 0.7));
        ecoBins.put("$75K-$100K", new ColorMapping("hsl(130 80% 45%)", 0.8));
        ecoBins.put("$100K-$150K", new ColorMapping("hsl(130 80% 35%)", 0.8));
        ecoBins.put("$150K-$200K", new ColorMapping("hsl(125 90% 30%)", 0.9));
        ecoBins.put("$200K+", new ColorMapping("hsl(120 90% 20%)", 1));

        povertyBins = new HashMap<>();
        povertyBins.put("0%-5%", new ColorMapping("hsl(75, 50%, 90%)", 0.6)); 
        povertyBins.put("5%-10%", new ColorMapping("hsl(75, 55%, 80%)", 0.6));
        povertyBins.put("10%-15%", new ColorMapping("hsl(80, 60%, 70%)", 0.6));
        povertyBins.put("15%-20%", new ColorMapping("hsl(80, 65%, 60%)", 0.7));
        povertyBins.put("20%-25%", new ColorMapping("hsl(90, 70%, 50%)", 0.7));
        povertyBins.put("25%-30%", new ColorMapping("hsl(90, 75%, 40%)", 0.8));
        povertyBins.put("30%-35%", new ColorMapping("hsl(100, 80%, 35%)", 0.8));
        povertyBins.put("35%-40%", new ColorMapping("hsl(105, 85%, 30%)", 0.9));
        povertyBins.put("40%+", new ColorMapping("hsl(110, 85%, 25%)", 1));
        
        regionBins = new HashMap<>();
        regionBins.put("Urban", new ColorMapping("hsl(130 70% 40%)", 0.8));
        regionBins.put("Suburban", new ColorMapping("hsl(190 35% 50%)", 0.8));
        regionBins.put("Rural", new ColorMapping("hsl(40 50% 75%)", 0.8));

        ecoPolBins = new HashMap<>();
        ecoPolBins.put("R-$0K-$15K", new ColorMapping("hsl(20 40% 85%)", 0.6));
        ecoPolBins.put("R-$15K-$25K", new ColorMapping("hsl(20 50% 75%)", 0.6));
        ecoPolBins.put("R-$25K-$35K", new ColorMapping("hsl(20 60% 65%)", 0.6));
        ecoPolBins.put("R-$35K-$50K", new ColorMapping("hsl(20 70% 60%)", 0.7));
        ecoPolBins.put("R-$50K-$75K", new ColorMapping("hsl(10 70% 50%)", 0.7));
        ecoPolBins.put("R-$75K-$100K", new ColorMapping("hsl(10 80% 45%)", 0.8));
        ecoPolBins.put("R-$100K-$150K", new ColorMapping("hsl(10 80% 35%)", 0.8));
        ecoPolBins.put("R-$150K-$200K", new ColorMapping("hsl(0 90% 30%)", 0.9));
        ecoPolBins.put("R-$200K+", new ColorMapping("hsl(0 90% 20%)", 1));
        ecoPolBins.put("D-$0K-$15K", new ColorMapping("hsl(230 40% 85%)", 0.6));
        ecoPolBins.put("D-$15K-$25K", new ColorMapping("hsl(230 50% 75%)", 0.6));
        ecoPolBins.put("D-$25K-$35K", new ColorMapping("hsl(230 60% 65%)", 0.6));
        ecoPolBins.put("D-$35K-$50K", new ColorMapping("hsl(230 70% 60%)", 0.7));
        ecoPolBins.put("D-$50K-$75K", new ColorMapping("hsl(240 70% 50%)", 0.7));
        ecoPolBins.put("D-$75K-$100K", new ColorMapping("hsl(240 80% 45%)", 0.8));
        ecoPolBins.put("D-$100K-$150K", new ColorMapping("hsl(240 80% 35%)", 0.8));
        ecoPolBins.put("D-$150K-$200K", new ColorMapping("hsl(250 90% 30%)", 0.9));
        ecoPolBins.put("D-$200K+", new ColorMapping("hsl(250 90% 20%)", 1));
    }

    public static Map<String, ColorMapping> getBins(List<String> filters){
        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case DEMOGRAPHIC: return demoBins; 
            case ECONOMIC: return ecoBins;
            case REGION_TYPE: return regionBins;
            case POVERTY_LEVEL: return povertyBins;
            case ECO_POLITICAL: return ecoPolBins;
            default: return null;
        }
    }

    public static ColorMapping handleBins(List<String> filters, PrecinctData info){
        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case DEMOGRAPHIC: return handleDemoBins(filters.get(1), info); 
            case ECONOMIC: return handleEcoBins(info);
            case REGION_TYPE: return handleRegionBins(info);
            case POVERTY_LEVEL: return handlePovertyBins(info);
            case ECO_POLITICAL: return handleEcoPolBins(info);
            default: return null;
        }
    }

    private static ColorMapping handleDemoBins(String filter, PrecinctData info){
        return defaultColorMapping;
    }

    private static ColorMapping handleEcoBins(PrecinctData info){
        int income = info.getMedianIncome();

        if(income >= 200000)
            return ecoBins.get("$200K+");
        else if(income >= 150000)
            return ecoBins.get("$150K-$200K");
        else if(income >= 100000)
            return ecoBins.get("$100K-$150K");
        else if(income >= 75000)
            return ecoBins.get("$75K-$100K");
        else if(income >= 50000)
            return ecoBins.get("$50K-$75K");
        else if(income >= 35000)
            return ecoBins.get("$35K-$50K");
        else if(income >= 25000)
            return ecoBins.get("$25K-$35K");
        else if(income >= 15000)
            return ecoBins.get("$15K-$25K");
        else
            return ecoBins.get("$0K-$15K");
    }

    private static ColorMapping handleRegionBins(PrecinctData info){
        if(info.getRegionType().equals(RegionTypeEnum.URBAN.toString()))
            return regionBins.get("Urban");
        else if(info.getRegionType().equals(RegionTypeEnum.SUBURBAN.toString()))
        return regionBins.get("Suburban");
        else if(info.getRegionType().equals(RegionTypeEnum.RURAL.toString()))
        return regionBins.get("Rural");

        return defaultColorMapping;
    }

    private static ColorMapping handlePovertyBins(PrecinctData info){
        double povertyRate = info.getPercentHouseholdsLivingBelowPovertyLevel();

        if(povertyRate >= 40)
            return povertyBins.get("40%+");
        else if(povertyRate >= 35)
            return povertyBins.get("35%-40%");
        else if(povertyRate >= 30)
            return povertyBins.get("30%-35%");
        else if(povertyRate >= 25)
            return povertyBins.get("25%-30%");
        else if(povertyRate >= 20)
            return povertyBins.get("20%-25%");
        else if(povertyRate >= 15)
            return povertyBins.get("15%-20%");
        else if(povertyRate >= 10)
            return povertyBins.get("10%-15%");
        else if(povertyRate >= 5)
            return povertyBins.get("5%-10%");
        else
            return povertyBins.get("0%-5%");        
    }

    private static ColorMapping handleEcoPolBins(PrecinctData info){
        char key = info.getMajorityParty().charAt(0);
        int income = info.getMedianIncome();

        if(income >= 200000)
            return ecoPolBins.get(key + "-$200K+");
        else if(income >= 150000)
            return ecoPolBins.get(key + "-$150K-$200K");
        else if(income >= 100000)
            return ecoPolBins.get(key + "-$100K-$150K");
        else if(income >= 75000)
            return ecoPolBins.get(key + "-$75K-$100K");
        else if(income >= 50000)
            return ecoPolBins.get(key + "-$50K-$75K");
        else if(income >= 35000)
            return ecoPolBins.get(key + "-$35K-$50K");
        else if(income >= 25000)
            return ecoPolBins.get(key + "-$25K-$35K");
        else if(income >= 15000)
            return ecoPolBins.get(key + "-$15K-$25K");
        else
            return ecoPolBins.get(key + "-$0K-$15K");
    }
}
