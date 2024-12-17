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
    public static ArrayList<ColorMapping> electoralBins;

    static {
        demoBins = new ArrayList<>();
        demoBins.add(new ColorMapping("50%+", "hsl(280, 90%, 15%)", 0.8));
        demoBins.add(new ColorMapping("25%-50%", "hsl(280, 75%, 25%)", 0.8));
        demoBins.add(new ColorMapping("20%-25%", "hsl(280, 65%, 35%)", 0.8));
        demoBins.add(new ColorMapping("15%-20%", "hsl(280, 60%, 50%)", 0.8));
        demoBins.add(new ColorMapping("10%-15%", "hsl(280, 60%, 70%)", 0.8));
        demoBins.add(new ColorMapping("5%-10%", "hsl(280, 50%, 80%)", 0.8));
        demoBins.add(new ColorMapping("0%-5%", "hsl(280, 40%, 90%)", 0.8));

        ecoBins = new ArrayList<>();
        ecoBins.add(new ColorMapping("$200K+", "hsl(160, 50%, 20%)", 1));
        ecoBins.add(new ColorMapping("$150K-$200K", "hsl(160, 50%, 30%)", 0.9));
        ecoBins.add(new ColorMapping("$100K-$150K", "hsl(140, 50%, 40%)", 0.8));
        ecoBins.add(new ColorMapping("$75K-$100K", "hsl(120, 50%, 50%)", 0.8));
        ecoBins.add(new ColorMapping("$50K-$75K", "hsl(100, 50%, 60%)", 0.7));
        ecoBins.add(new ColorMapping("$35K-$50K", "hsl(80, 60%, 70%)", 0.7));
        ecoBins.add(new ColorMapping("$25K-$35K", "hsl(60, 80%, 70%)", 0.6));
        ecoBins.add(new ColorMapping("$15K-$25K", "hsl(60, 80%, 80%)", 0.6));
        ecoBins.add(new ColorMapping("$0K-$15K", "hsl(60, 80%, 90%)", 0.6));

        povertyBins = new ArrayList<>();
        povertyBins.add(new ColorMapping("40%+", "hsl(32, 90%, 35%)", 1));
        povertyBins.add(new ColorMapping("35%-40%", "hsl(35, 85%, 40%)", 0.9));
        povertyBins.add(new ColorMapping("30%-35%", "hsl(38, 80%, 45%)", 0.8));
        povertyBins.add(new ColorMapping("25%-30%", "hsl(40, 75%, 50%)", 0.8));
        povertyBins.add(new ColorMapping("20%-25%", "hsl(42, 70%, 60%)", 0.7));
        povertyBins.add(new ColorMapping("15%-20%", "hsl(44, 75%, 65%)", 0.7));
        povertyBins.add(new ColorMapping("10%-15%", "hsl(46, 80%, 70%)", 0.6));
        povertyBins.add(new ColorMapping("5%-10%", "hsl(48, 85%, 80%)", 0.6));
        povertyBins.add(new ColorMapping("0%-5%", "hsl(50, 90%, 90%)", 0.6));

        regionBins = new ArrayList<>();
        regionBins.add(new ColorMapping("Urban", "hsl(150, 70%, 40%)", 0.8));
        regionBins.add(new ColorMapping("Suburban", "hsl(220, 50%, 75%)", 0.8));
        regionBins.add(new ColorMapping("Rural", "hsl(40, 50%, 90%)", 0.8));

        ecoPolBins = new ArrayList<>();
        ecoPolBins.add(new ColorMapping("R-$200K+", "hsl(0, 100%, 15%)", 1));
        ecoPolBins.add(new ColorMapping("R-$150K-$200K", "hsl(0, 90%, 20%)", 0.9));
        ecoPolBins.add(new ColorMapping("R-$100K-$150K", "hsl(0, 80%, 30%)", 0.8));
        ecoPolBins.add(new ColorMapping("R-$75K-$100K", "hsl(0, 70%, 45%)", 0.8));
        ecoPolBins.add(new ColorMapping("R-$50K-$75K", "hsl(0, 60%, 50%)", 0.7));
        ecoPolBins.add(new ColorMapping("R-$35K-$50K", "hsl(0, 50%, 60%)", 0.7));
        ecoPolBins.add(new ColorMapping("R-$25K-$35K", "hsl(0, 50%, 70%)", 0.5));
        ecoPolBins.add(new ColorMapping("R-$15K-$25K", "hsl(0, 40%, 80%)", 0.5));
        ecoPolBins.add(new ColorMapping("R-$0K-$15K", "hsl(0, 14.60%, 67.80%)", 0.4));
        ecoPolBins.add(new ColorMapping("D-$200K+", "hsl(240, 100%, 15%)", 1));
        ecoPolBins.add(new ColorMapping("D-$150K-$200K", "hsl(240, 90%, 20%)", 0.9));
        ecoPolBins.add(new ColorMapping("D-$100K-$150K", "hsl(240, 80%, 30%)", 0.8));
        ecoPolBins.add(new ColorMapping("D-$75K-$100K", "hsl(240, 70%, 45%)", 0.8));
        ecoPolBins.add(new ColorMapping("D-$50K-$75K", "hsl(240, 60%, 50%)", 0.7));
        ecoPolBins.add(new ColorMapping("D-$35K-$50K", "hsl(240, 50%, 60%)", 0.7));
        ecoPolBins.add(new ColorMapping("D-$25K-$35K", "hsl(240, 50%, 70%)", 0.5));
        ecoPolBins.add(new ColorMapping("D-$15K-$25K", "hsl(240, 40%, 80%)", 0.5));
        ecoPolBins.add(new ColorMapping("D-$0K-$15K", "hsl(240, 35%, 85%)", 0.4));

        electoralBins = new ArrayList<>();
        electoralBins.add(new ColorMapping("R-50%+", "hsl(0, 80%, 25%)", 1));
        electoralBins.add(new ColorMapping("R-40%-50%", "hsl(0, 70%, 35%)", 0.85));
        electoralBins.add(new ColorMapping("R-30%-40%", "hsl(0, 60%, 40%)", 0.7));
        electoralBins.add(new ColorMapping("R-20%-30%", "hsl(0, 50%, 55%)", 0.6));
        electoralBins.add(new ColorMapping("R-10%-20%", "hsl(0, 50%, 70%)", 0.5));
        electoralBins.add(new ColorMapping("R-0%-10%", "hsl(0, 30%, 80%)", 0.4));
        electoralBins.add(new ColorMapping("D-50%+", "hsl(240, 80%, 25%)", 1));
        electoralBins.add(new ColorMapping("D-40%-50%", "hsl(240, 70%, 35%)", 0.85));
        electoralBins.add(new ColorMapping("D-30%-40%", "hsl(240, 60%, 40%)", 0.7));
        electoralBins.add(new ColorMapping("D-20%-30%", "hsl(240, 50%, 55%)", 0.6));
        electoralBins.add(new ColorMapping("D-10%-20%", "hsl(240, 50%, 70%)", 0.5));
        electoralBins.add(new ColorMapping("D-0%-10%", "hsl(240, 30%, 80%)", 0.4));
    }

    @Cacheable(value = "", key = "#filters[0]")
    public static ArrayList<ColorMapping> getBins(List<String> filters) {
        if (filters == null)
            return null;

        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch (filter) {
            case NONE:
                return null;
            case DEMOGRAPHIC:
                return demoBins;
            case ECONOMIC:
                return ecoBins;
            case REGION_TYPE:
                return regionBins;
            case POVERTY_LEVEL:
                return povertyBins;
            case ECO_POLITICAL:
                return ecoPolBins;
            case ELECTORAL:
                return electoralBins;
            default:
                return null;
        }
    }

    public static ColorMapping handleBins(List<String> filters, PrecinctData info) {
        if (filters == null || info == null)
            return new ColorMapping("", "", 0.75);

        MapFiltersEnum filter = MapFiltersEnum.fromValue(filters.get(0));
        switch (filter) {
            case NONE:
                return new ColorMapping("", "", 0.75);
            case DEMOGRAPHIC:
                return handleDemoBins(filters, info);
            case ECONOMIC:
                return handleEcoBins(info);
            case REGION_TYPE:
                return handleRegionBins(info);
            case POVERTY_LEVEL:
                return handlePovertyBins(info);
            case ECO_POLITICAL:
                return handleEcoPolBins(info);
            case ELECTORAL:
                return handleElectoralBins(info);
            default:
                return null;
        }
    }

    private static ColorMapping handleDemoBins(List<String> filter, PrecinctData info) {
        if (filter.size() < 2)
            return defaultColorMapping;

        int totalPopulation = 0;

        if (filter.get(1).equalsIgnoreCase("black"))
            totalPopulation = (int) info.getRaceDistribution().get("Black");
        else if (filter.get(1).equalsIgnoreCase("asian"))
            totalPopulation = (int) info.getRaceDistribution().get("Asian");
        else if (filter.get(1).equalsIgnoreCase("hispanic"))
            totalPopulation = (int) info.getRaceDistribution().get("Hispanic or Latino");
        else
            return defaultColorMapping;

        double percentage = (double) totalPopulation / info.getTotalPopulation();

        if (percentage >= 0.5)
            return demoBins.get(0);
        else if (percentage >= 0.25)
            return demoBins.get(1);
        else if (percentage >= 0.2)
            return demoBins.get(2);
        else if (percentage >= 0.15)
            return demoBins.get(3);
        else if (percentage >= 0.10)
            return demoBins.get(4);
        else if (percentage >= 0.05)
            return demoBins.get(5);
        else
            return demoBins.get(6);
    }

    private static ColorMapping handleEcoBins(PrecinctData info) {
        double income = info.getMedianIncome();

        if (income >= 200000)
            return ecoBins.get(0);
        else if (income >= 150000)
            return ecoBins.get(1);
        else if (income >= 100000)
            return ecoBins.get(2);
        else if (income >= 75000)
            return ecoBins.get(3);
        else if (income >= 50000)
            return ecoBins.get(4);
        else if (income >= 35000)
            return ecoBins.get(5);
        else if (income >= 25000)
            return ecoBins.get(6);
        else if (income >= 15000)
            return ecoBins.get(7);
        else
            return ecoBins.get(8);
    }

    private static ColorMapping handleRegionBins(PrecinctData info) {
        if (info.getRegionType().equals(RegionTypeEnum.URBAN.toString()))
            return regionBins.get(0);
        else if (info.getRegionType().equals(RegionTypeEnum.SUBURBAN.toString()))
            return regionBins.get(1);
        else if (info.getRegionType().equals(RegionTypeEnum.RURAL.toString()))
            return regionBins.get(2);

        return defaultColorMapping;
    }

    private static ColorMapping handlePovertyBins(PrecinctData info) {
        double povertyRate = info.getPovertyRate();

        if (povertyRate >= 40)
            return povertyBins.get(0);
        else if (povertyRate >= 35)
            return povertyBins.get(1);
        else if (povertyRate >= 30)
            return povertyBins.get(2);
        else if (povertyRate >= 25)
            return povertyBins.get(3);
        else if (povertyRate >= 20)
            return povertyBins.get(4);
        else if (povertyRate >= 15)
            return povertyBins.get(5);
        else if (povertyRate >= 10)
            return povertyBins.get(6);
        else if (povertyRate >= 5)
            return povertyBins.get(7);
        else
            return povertyBins.get(8);
    }

    private static ColorMapping handleEcoPolBins(PrecinctData info) {
        char key = info.getMajorityParty().charAt(0);
        int offset = (key == 'D') ? (ecoPolBins.size() / 2) : 0;
        double income = info.getMedianIncome();

        if (income >= 200000)
            return ecoPolBins.get(offset + 0);
        else if (income >= 150000)
            return ecoPolBins.get(offset + 1);
        else if (income >= 100000)
            return ecoPolBins.get(offset + 2);
        else if (income >= 75000)
            return ecoPolBins.get(offset + 3);
        else if (income >= 50000)
            return ecoPolBins.get(offset + 4);
        else if (income >= 35000)
            return ecoPolBins.get(offset + 5);
        else if (income >= 25000)
            return ecoPolBins.get(offset + 6);
        else if (income >= 15000)
            return ecoPolBins.get(offset + 7);
        else
            return ecoPolBins.get(offset + 8);
    }

    private static ColorMapping handleElectoralBins(PrecinctData info) {
        double repSplit = (int) info.getVoteDistribution().get("Republican");
        double demSplit = (int) info.getVoteDistribution().get("Democratic");
        double totalVotes = repSplit + demSplit;
        double voteMargin;

        repSplit = repSplit / totalVotes;
        demSplit = demSplit / totalVotes;
        voteMargin = Math.abs(repSplit - demSplit);

        int offset = (demSplit > repSplit) ? (electoralBins.size() / 2) : 0;

        if (voteMargin > 0.5)
            return electoralBins.get(offset + 0);
        else if (voteMargin > 0.4)
            return electoralBins.get(offset + 1);
        else if (voteMargin > 0.3)
            return electoralBins.get(offset + 2);
        else if (voteMargin > 0.2)
            return electoralBins.get(offset + 3);
        else if (voteMargin > 0.1)
            return electoralBins.get(offset + 4);
        else
            return electoralBins.get(offset + 5);
    }
}
