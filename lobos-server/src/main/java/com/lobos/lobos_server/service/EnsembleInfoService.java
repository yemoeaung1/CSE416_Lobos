package com.lobos.lobos_server.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Boxplot;
import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.repository.EnsembleInfoRepository;
import com.lobos.lobos_server.utilities.ColorMapping;

@Service
public class EnsembleInfoService {

    private final EnsembleInfoRepository ensembleInfoRepository;

    @Autowired
    public EnsembleInfoService(EnsembleInfoRepository ensembleInfoRepository) {
        this.ensembleInfoRepository = ensembleInfoRepository;
    }

    public EnsembleInfo getEnsembleInfoForState(String state) {
        return ensembleInfoRepository.findFirstByState(state);
    }

    public List<EnsembleInfo> getAllEnsembleInfo() {
        return ensembleInfoRepository.findAll();
    }

    @Cacheable(value = "ensemble-boxplot-cache", key = "#state + '-' + #filter + '-' + #category")
    public Map<String, Object> retrieveBoxPlotData(String state, String filter, String category) {
        EnsembleInfo ensembleInfo = getEnsembleInfoForState(state);
        Map<String, Map<String, Boxplot>> boxplot = ensembleInfo.getBoxplot();
        if (filter.equals("poverty_rate")) {
            filter = "households_below_poverty_line";
        }
        Map<String, Boxplot> districtData = boxplot.get(filter);
        List<Map.Entry<String, Boxplot>> sortedDistricts = new ArrayList<>(districtData.entrySet());
        sortedDistricts.sort(Comparator.comparing(entry -> entry.getValue().getMedian()));
        Map<String, Boxplot> sortedDistrictMap = new LinkedHashMap<>();
        for (Map.Entry<String, Boxplot> district : sortedDistricts) {
            sortedDistrictMap.put(district.getKey(), district.getValue());
        }
        Map<String, Object> formattedData = formatBoxplotData(sortedDistrictMap, filter, category);
        return formattedData;
    }

    public Map<String, Object> formatBoxplotData(Map<String, Boxplot> sortedDistricts, String filter, String category) {
        ColorMapping color = getColorMappingByCategory(category, filter);

        List<String> labels = new ArrayList<>(sortedDistricts.keySet());
        List<Double> currentPlanData = new ArrayList<>();
        List<Map<String, Double>> groupData = new ArrayList<>();

        for (Boxplot boxplot : sortedDistricts.values()) {
            Map<String, Double> boxplotValues = new HashMap<>();
            boxplotValues.put("min", boxplot.getMin());
            boxplotValues.put("q1", boxplot.getQ1());
            boxplotValues.put("median", boxplot.getMedian());
            boxplotValues.put("q3", boxplot.getQ3());
            boxplotValues.put("max", boxplot.getMax());
            groupData.add(boxplotValues);
            currentPlanData.add(boxplot.getEnacted());
        }

        Map<String, Object> dataSet = new HashMap<>();
        dataSet.put("label", "Recom Ensemble");
        dataSet.put("backgroundColor", color.getColor());
        dataSet.put("borderColor", "black");
        dataSet.put("borderWidth", 1);
        dataSet.put("outlierColor", "#999999");
        dataSet.put("padding", 5);
        dataSet.put("itemRadius", 2);
        dataSet.put("data", groupData);

        Map<String, Object> currentPlanDataSet = new HashMap<>();
        currentPlanDataSet.put("type", "scatter");
        currentPlanDataSet.put("label", "Enacted");
        currentPlanDataSet.put("data", currentPlanData);
        currentPlanDataSet.put("backgroundColor", "red");
        currentPlanDataSet.put("borderColor", "black");
        currentPlanDataSet.put("radius", 5);
        currentPlanDataSet.put("pointStyle", "circle");
        currentPlanDataSet.put("showLine", false);

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", Arrays.asList(currentPlanDataSet, dataSet));
        result.put("title", String.format("Population Distribution Across District Plans"));
        result.put("yLabel", "Population Percentage (%)");
        result.put("xLabel", "Sorted Districts");

        return result;
    }

    @Cacheable(value = "ensemble-splits-cache", key = "#state")
    public Map<String, Object> retrieveSplits(String state) {
        Map<String, Object> data = new HashMap<>();
        EnsembleInfo info = getEnsembleInfoForState(state);
        Map<String, Integer> splits = info.getSplits();
        List<String> splitLabels = new ArrayList<>(splits.keySet());
        List<Integer> values = new ArrayList<>(splits.values());

        data.put("labels", splitLabels);
        data.put("data", values);
        data.put("backgroundColor", "hsl(0, 80%, 60%)");
        data.put("borderColor", "black");
        data.put("borderWidth", 1);
        data.put("outlierColor", "#999999");
        data.put("padding", 5);
        data.put("itemRadius", 2);
        data.put("title", String.format("Republican/Democrat Splits In %s After Simulations By District", state));
        data.put("xLabel", "Republican/Democrat Splits");
        data.put("yLabel", "Number of Plans");

        return data;
    }

    @Cacheable(value = "ensemble-district-win-counts-cache", key = "#state")
    public Map<String, Object> retrieveDistrictWinCounts(String state) {
        Map<String, Object> data = new HashMap<>();
        EnsembleInfo ensembleInfo = getEnsembleInfoForState(state);
        Map<String, List<Integer>> districtWinTally = ensembleInfo.getDistrictWinnerTally();

        List<String> districtNames = new ArrayList<>(districtWinTally.keySet());
        List<Integer> republicanWins = new ArrayList<>();
        List<Integer> democratWins = new ArrayList<>();

        for (List<Integer> winsPerDistrict : districtWinTally.values()) {
            republicanWins.add(winsPerDistrict.get(0));
            democratWins.add(winsPerDistrict.get(1));
        }

        data.put("labels", districtNames);
        data.put("republicanLabel", "Republican Wins");
        data.put("republicanWins", republicanWins);
        data.put("republicanColor", "red");
        data.put("democratLabel", "Democrat Wins");
        data.put("democratWins", democratWins);
        data.put("democratColor", "blue");
        data.put("borderColor", "black");
        data.put("borderWidth", 1);
        data.put("outlierColor", "#999999");
        data.put("padding", 5);
        data.put("itemRadius", 2);
        data.put("title", String.format("Simulated District-Level Wins in %s", state));
        data.put("xLabel", "Districts");
        data.put("yLabel", "Number of Wins");

        return data;
    }

    public ColorMapping getColorMappingByCategory(String category, String filter) {
        switch (category) {
            case "income":
                return new ColorMapping(filter, "hsla(132, 96.70%, 23.50%, 0.70)", 0.2);
            case "voting":
                String color = filter.equals("2020_PRES_R") ? "hsla(0, 96.90%, 37.60%, 0.66)" : "hsla(240, 60.00%, 50.00%, 0.66)";
                return new ColorMapping(filter, color, 0.2);
            case "demographics":
                return new ColorMapping("50%+", "hsla(279, 92.30%, 35.90%, 0.74)", 0.2);
            case "regionType":
                return new ColorMapping("Urban", "hsla(66, 30.30%, 60.60%, 0.76)", 0.2);
            default:
                throw new IllegalArgumentException("Unknown category: " + category);
        }
    }

}
