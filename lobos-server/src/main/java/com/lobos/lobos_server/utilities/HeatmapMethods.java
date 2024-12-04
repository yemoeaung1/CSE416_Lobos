package com.lobos.lobos_server.utilities;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lobos.lobos_server.enum_classes.FiltersEnum;

public class HeatmapMethods {
    public static Map<String, Object> handleBins(List<String> filters, Object info){
        FiltersEnum filter = FiltersEnum.fromValue(filters.get(0));
        switch(filter){
            case DEMOGRAPHIC: return handleDemoBins(filters.get(1)); 
            case ECONOMIC: return handleEcoBins();
            case REGION_TYPE: return handleRegionBins();
            case POVERTY_LEVEL: return handlePovertyBins();
            case ECO_DEMOGRAPHIC: return handleEcoDemoBins();
            default: return null;
        }
    }

    private static Map<String, Object> handleDemoBins(String filter){
        Map<String, Object> colorMapping = new HashMap<>();

        colorMapping.put("Color", "#ffffff");
        colorMapping.put("Opacity", 0.5);

        return colorMapping;
    }

    private static Map<String, Object> handleEcoBins(){
        Map<String, Object> colorMapping = new HashMap<>();

        colorMapping.put("Color", "#0000ff");
        colorMapping.put("Opacity", 0.5);

        return colorMapping;
    }

    private static Map<String, Object> handleRegionBins(){
        Map<String, Object> colorMapping = new HashMap<>();

        colorMapping.put("Color", "#ffffff");
        colorMapping.put("Opacity", 0.5);

        return colorMapping;
    }

    private static Map<String, Object> handlePovertyBins(){
        Map<String, Object> colorMapping = new HashMap<>();

        colorMapping.put("Color", "#ffffff");
        colorMapping.put("Opacity", 0.5);

        return colorMapping;
    }

    private static Map<String, Object> handleEcoDemoBins(){
        Map<String, Object> colorMapping = new HashMap<>();

        colorMapping.put("Color", "#ffffff");
        colorMapping.put("Opacity", 0.5);

        return colorMapping;
    }
}
