package com.lobos.lobos_server.utilities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cache.annotation.Cacheable;

import com.lobos.lobos_server.enum_classes.MapFiltersEnum;
import com.lobos.lobos_server.enum_classes.RegionTypeEnum;
import com.lobos.lobos_server.model.PrecinctData;

public class HeatmapMethods {

    public static ColorMapping defaultColorMapping = new ColorMapping("Default", "#FFFFFF", 0.8);

    public static ArrayList<ColorMapping> demoBins;
    public static ArrayList<ColorMapping> ecoBins;
    public static ArrayList<ColorMapping> povertyBins;
    public static ArrayList<ColorMapping> regionBins;
    public static ArrayList<ColorMapping> ecoPolBins;

    static {
        demoBins = new ArrayList<>();
        demoBins.add(new ColorMapping("Default", "#FFFFFF", 0.8));

        ecoBins = new ArrayList<>();
        ecoBins.add(new ColorMapping("$200K+", "hsl(120 90% 20%)", 1));
        ecoBins.add(new ColorMapping("$150K-$200K", "hsl(125 90% 30%)", 0.9));
        ecoBins.add(new ColorMapping("$100K-$150K", "hsl(130 80% 35%)", 0.8));
        ecoBins.add(new ColorMapping("$75K-$100K", "hsl(130 80% 45%)", 0.8));
        ecoBins.add(new ColorMapping("$50K-$75K", "hsl(135 70% 50%)", 0.7));
        ecoBins.add(new ColorMapping("$35K-$50K", "hsl(135 70% 60%)", 0.7));
        ecoBins.add(new ColorMapping("$25K-$35K", "hsl(140 60% 65%)", 0.6));
        ecoBins.add(new ColorMapping("$15K-$25K", "hsl(140 50% 75%)", 0.6));
        ecoBins.add(new ColorMapping("$0K-$15K", "hsl(140 40% 85%)", 0.6));

        povertyBins = new ArrayList<>();
        povertyBins.add(new ColorMapping("40%+", "hsl(110, 85%, 25%)", 1));
        povertyBins.add( new ColorMapping("35%-40%", "hsl(105, 85%, 30%)", 0.9));
        povertyBins.add(new ColorMapping("30%-35%", "hsl(100, 80%, 35%)", 0.8));
        povertyBins.add(new ColorMapping("25%-30%", "hsl(90, 75%, 40%)", 0.8));
        povertyBins.add(new ColorMapping("20%-25%", "hsl(90, 70%, 50%)", 0.7));
        povertyBins.add(new ColorMapping("15%-20%", "hsl(80, 65%, 60%)", 0.7));
        povertyBins.add(new ColorMapping("10%-15%", "hsl(80, 60%, 70%)", 0.6));
        povertyBins.add(new ColorMapping("5%-10%", "hsl(75, 55%, 80%)", 0.6));
        povertyBins.add(new ColorMapping("0%-5%", "hsl(75, 50%, 90%)", 0.6)); 
        
        regionBins = new ArrayList<>();
        regionBins.add(new ColorMapping("Urban", "hsl(130 70% 40%)", 0.8));
        regionBins.add(new ColorMapping("Suburban", "hsl(190 35% 50%)", 0.8));
        regionBins.add(new ColorMapping("Rural", "hsl(40 50% 75%)", 0.8));

        ecoPolBins = new ArrayList<>();
        ecoPolBins.add(new ColorMapping("R-$200K+", "hsl(0 90% 20%)", 1));
        ecoPolBins.add(new ColorMapping("R-$150K-$200K", "hsl(0 90% 30%)", 0.9));
        ecoPolBins.add(new ColorMapping("R-$100K-$150K", "hsl(10 80% 35%)", 0.8));
        ecoPolBins.add(new ColorMapping("R-$75K-$100K", "hsl(10 80% 45%)", 0.8));
        ecoPolBins.add(new ColorMapping("R-$50K-$75K", "hsl(10 70% 50%)", 0.7));
        ecoPolBins.add(new ColorMapping("R-$35K-$50K", "hsl(20 70% 60%)", 0.7));
        ecoPolBins.add(new ColorMapping("R-$25K-$35K", "hsl(20 60% 65%)", 0.6));
        ecoPolBins.add(new ColorMapping("R-$15K-$25K", "hsl(20 50% 75%)", 0.6));
        ecoPolBins.add(new ColorMapping("R-$0K-$15K", "hsl(20 40% 85%)", 0.6));
        ecoPolBins.add(new ColorMapping("D-$200K+", "hsl(250 90% 20%)", 1));
        ecoPolBins.add(new ColorMapping("D-$150K-$200K", "hsl(250 90% 30%)", 0.9));
        ecoPolBins.add(new ColorMapping("D-$100K-$150K", "hsl(240 80% 35%)", 0.8));
        ecoPolBins.add(new ColorMapping("D-$75K-$100K", "hsl(240 80% 45%)", 0.8));
        ecoPolBins.add(new ColorMapping("D-$50K-$75K", "hsl(240 70% 50%)", 0.7));
        ecoPolBins.add(new ColorMapping("D-$35K-$50K", "hsl(230 70% 60%)", 0.7));
        ecoPolBins.add(new ColorMapping("D-$25K-$35K", "hsl(230 60% 65%)", 0.6));
        ecoPolBins.add(new ColorMapping("D-$15K-$25K", "hsl(230 50% 75%)", 0.6));
        ecoPolBins.add(new ColorMapping("D-$0K-$15K", "hsl(230 40% 85%)", 0.6));
    }

    @Cacheable(value = "", key = "#filters[0]")
    public static ArrayList<ColorMapping> getBins(List<String> filters){
        if(filters == null)
            return null;

        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case NONE: return null;
            case DEMOGRAPHIC: return demoBins; 
            case ECONOMIC: return ecoBins;
            case REGION_TYPE: return regionBins;
            case POVERTY_LEVEL: return povertyBins;
            case ECO_POLITICAL: return ecoPolBins;
            default: return null;
        }
    }

    public static ColorMapping handleBins(List<String> filters, PrecinctData info){
        if(filters == null || info == null)
            return new ColorMapping("", "", 0.75);

        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case NONE: return new ColorMapping("", "", 0.75);
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
        double income = info.getMedianIncome();

        if(income >= 200000)
            return ecoBins.get(0);
        else if(income >= 150000)
            return ecoBins.get(1);
        else if(income >= 100000)
            return ecoBins.get(2);
        else if(income >= 75000)
            return ecoBins.get(3);
        else if(income >= 50000)
            return ecoBins.get(4);
        else if(income >= 35000)
            return ecoBins.get(5);
        else if(income >= 25000)
            return ecoBins.get(6);
        else if(income >= 15000)
            return ecoBins.get(7);
        else
            return ecoBins.get(8);
    }

    private static ColorMapping handleRegionBins(PrecinctData info){
        if(info.getRegionType().equals(RegionTypeEnum.URBAN.toString()))
            return regionBins.get(0);
        else if(info.getRegionType().equals(RegionTypeEnum.SUBURBAN.toString()))
        return regionBins.get(1);
        else if(info.getRegionType().equals(RegionTypeEnum.RURAL.toString()))
        return regionBins.get(2);

        return defaultColorMapping;
    }

    private static ColorMapping handlePovertyBins(PrecinctData info){
        double povertyRate = info.getPovertyRate();

        if(povertyRate >= 40)
            return povertyBins.get(0);
        else if(povertyRate >= 35)
            return povertyBins.get(1);
        else if(povertyRate >= 30)
            return povertyBins.get(2);
        else if(povertyRate >= 25)
            return povertyBins.get(3);
        else if(povertyRate >= 20)
            return povertyBins.get(4);
        else if(povertyRate >= 15)
            return povertyBins.get(5);
        else if(povertyRate >= 10)
            return povertyBins.get(6);
        else if(povertyRate >= 5)
            return povertyBins.get(7);
        else
            return povertyBins.get(8);        
    }

    private static ColorMapping handleEcoPolBins(PrecinctData info){
        char key = info.getMajorityParty().charAt(0);
        int offset = (key == 'D') ? 9 : 0;
        double income = info.getMedianIncome();

        if(income >= 200000)
            return ecoPolBins.get(offset + 0);
        else if(income >= 150000)
            return ecoPolBins.get(offset + 1);
        else if(income >= 100000)
            return ecoPolBins.get(offset + 2);
        else if(income >= 75000)
            return ecoPolBins.get(offset + 3);
        else if(income >= 50000)
            return ecoPolBins.get(offset + 4);
        else if(income >= 35000)
            return ecoPolBins.get(offset + 5);
        else if(income >= 25000)
            return ecoPolBins.get(offset + 6);
        else if(income >= 15000)
            return ecoPolBins.get(offset + 7);
        else
            return ecoPolBins.get(offset + 8);
    }
}
