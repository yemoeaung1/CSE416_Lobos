package com.lobos.lobos_server.utilities;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lobos.lobos_server.enum_classes.FiltersEnum;
import com.lobos.lobos_server.enum_classes.RegionTypeEnum;
import com.lobos.lobos_server.model.PrecinctData;

public class HeatmapMethods {

    public static ColorMapping defaultColorMapping = new ColorMapping("#FFFFFF", 0.8);

    public static Map<String, ColorMapping> demoBins;
    public static Map<String, ColorMapping> ecoBins;
    public static Map<String, ColorMapping> povertyBins;
    public static Map<String, ColorMapping> regionBins;
    public static Map<String, ColorMapping> ecoDemoBins;

    static {
        demoBins = new HashMap<>();
        demoBins.put("KEY", new ColorMapping("#FFFFFF", 0.8));

        ecoBins = new HashMap<>();
        ecoBins.put("$0K-$15K", new ColorMapping("#B7E8B4", 0.4));
        ecoBins.put("$15K-$25K", new ColorMapping("#A9DFBF", 0.45));
        ecoBins.put("$25K-$35K", new ColorMapping("#98FB98", 0.5));
        ecoBins.put("$35K-$50K", new ColorMapping("#8FBC8F", 0.55));
        ecoBins.put("$50K-$75K", new ColorMapping("#66CDAA", 0.6));
        ecoBins.put("$75K-$100K", new ColorMapping("#3CB371", 0.65));
        ecoBins.put("$100K-$150K", new ColorMapping("#32CD32", 0.7));
        ecoBins.put("$150K-$200K", new ColorMapping("#228B22", 0.75));
        ecoBins.put("$200K+", new ColorMapping("#006400", 0.8));

        povertyBins = new HashMap<>();
        povertyBins.put("0%-5%", new ColorMapping("#FFFFFF", 0.4));
        povertyBins.put("5%-10%", new ColorMapping("#FFFFFF", 0.45));
        povertyBins.put("10%-15%", new ColorMapping("#FFFFFF", 0.5));
        povertyBins.put("15%-20%", new ColorMapping("#FFFFFF", 0.55));
        povertyBins.put("20%-25%", new ColorMapping("#FFFFFF", 0.6));
        povertyBins.put("25%-30%", new ColorMapping("#FFFFFF", 0.65));
        povertyBins.put("30%-35%", new ColorMapping("#FFFFFF", 0.7));
        povertyBins.put("35%-40%", new ColorMapping("#FFFFFF", 0.75));
        povertyBins.put("40%+", new ColorMapping("#FFFFFF", 0.8));
        
        regionBins = new HashMap<>();
        regionBins.put("Urban", new ColorMapping("#50C878", 0.8));
        regionBins.put("Suburban", new ColorMapping("#008080", 0.8));
        regionBins.put("Rural", new ColorMapping("#D2B48C", 0.8));

        ecoDemoBins = new HashMap<>();
    }

    public static Map<String, ColorMapping> getBins(List<String> filters){
        FiltersEnum filter = FiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case DEMOGRAPHIC: return demoBins; 
            case ECONOMIC: return ecoBins;
            case REGION_TYPE: return regionBins;
            case POVERTY_LEVEL: return povertyBins;
            case ECO_DEMOGRAPHIC: return ecoDemoBins;
            default: return null;
        }
    }

    public static ColorMapping handleBins(List<String> filters, PrecinctData info){
        FiltersEnum filter = FiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case DEMOGRAPHIC: return handleDemoBins(filters.get(1), info); 
            case ECONOMIC: return handleEcoBins(info);
            case REGION_TYPE: return handleRegionBins(info);
            case POVERTY_LEVEL: return handlePovertyBins(info);
            case ECO_DEMOGRAPHIC: return handleEcoDemoBins(info);
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
        double povertyRate = info.getPercentHouseholdsLivingBelowPovertyLine();

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

    private static ColorMapping handleEcoDemoBins(PrecinctData info){
        return defaultColorMapping;
    }
}
