package com.lobos.lobos_server;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lobos.lobos_server.model.Boxplot;
import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.service.EnsembleInfoService;
import com.lobos.lobos_server.utilities.ColorMapping;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EnsembleInfoController {

    private final EnsembleInfoService ensembleInfoService;

    @Autowired
    public EnsembleInfoController(EnsembleInfoService ensembleInfoService) {
        this.ensembleInfoService = ensembleInfoService;
    }

    @GetMapping("/ensemble-splits")
    public ResponseEntity<Map<String, Object>> getEnsembleInfo(@RequestParam String state) {
        Map<String, Object> data = new HashMap<>();
        EnsembleInfo info = ensembleInfoService.getEnsembleInfoForState(state);
        Map<String, Integer> splits = info.getSplits();
        List<String> labels = new ArrayList<>(splits.keySet());
        List<Integer> values = new ArrayList<>(splits.values());

        System.out.println(info.getSplits());
        data.put("labels",  labels);
        data.put("dataSets", values);
        data.put("backgroundColor", "red");
        data.put("borderColor", "black");
        data.put("borderWidth", 1);
        data.put("outlierColor", "#999999");
        data.put("padding", 5);
        data.put("itemRadius", 2);
        data.put("title", String.format("Republican/Democrat Splits In %s After Simulations By District", state));


        return ResponseEntity.ok(data);
    }

    @GetMapping("/ensemble-data")
    public ResponseEntity<Map<String, Object>> showSortedBox(String state, String filter, String category) {
        Map<String, Boxplot> sortedDistricts = getBoxandWhiskerData(state, filter);
        Map<String, Object> data = formatBoxplotData(sortedDistricts, category, filter);
        return ResponseEntity.ok(data);
    }

    private Map<String, Boxplot> getBoxandWhiskerData(String state, String filter) {
        // Retrieve the EnsembleInfo object
        EnsembleInfo ensembleInfo = ensembleInfoService.getEnsembleInfoForState(state);

        // Get the Boxplot map from the EnsembleInfo using the filter
        Map<String, Map<String, Boxplot>> boxplot = ensembleInfo.getBoxplot();

        if (filter.equals("poverty_rate")) {
            filter = "households_below_poverty_line";
        }

        Map<String, Boxplot> districtData = boxplot.get(filter);

        List<Map.Entry<String, Boxplot>> sortedDistricts = new ArrayList<>(districtData.entrySet());
        sortedDistricts.sort(Comparator.comparing(entry -> entry.getValue().getMedian()));

        Map<String, Boxplot> sortedDistrictMap = new LinkedHashMap<>();
        // Iterate through the sorted list and populate the new map
        for (Map.Entry<String, Boxplot> district : sortedDistricts) {
            sortedDistrictMap.put(district.getKey(), district.getValue());
        }

        return sortedDistrictMap;
    }

    private Map<String, Object> formatBoxplotData(Map<String, Boxplot> sortedDistricts, String category, String filter) {
        ColorMapping color = getColorMappingByCategory(category, filter);
        List<String> labels = new ArrayList<>(sortedDistricts.keySet());

        // List<Map<String, Object>> data = new ArrayList<>();
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

        // 4. Create the data for "Current Plan"
        Map<String, Object> currentPlanDataSet = new HashMap<>();
        currentPlanDataSet.put("type", "scatter");
        currentPlanDataSet.put("label", "Enacted");
        currentPlanDataSet.put("data", currentPlanData);
        currentPlanDataSet.put("backgroundColor", "red");
        currentPlanDataSet.put("borderColor", "black");
        currentPlanDataSet.put("radius", 5);
        currentPlanDataSet.put("pointStyle", "circle");
        currentPlanDataSet.put("showLine", false);

        // 5. Build the final map
        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", Arrays.asList(currentPlanDataSet, dataSet));
        result.put("title", String.format("Population Distribution Across District Plans"));

        return result;
    }

    private ColorMapping getColorMappingByCategory(String category, String filter) {
        // Map<String, Object> colors = new HashMap<>();

        switch (category) {
            case "Income":
                return new ColorMapping(filter, "hsla(132, 96.70%, 23.50%, 0.70)", 0.2);

            case "Voting":
                String color = filter.equals("2020_PRES_R") ? "hsla(0, 96.90%, 37.60%, 0.66)" : "hsla(240, 60.00%, 50.00%, 0.66)";
                return new ColorMapping(filter, color, 0.2);

            case "Demographics":
                return new ColorMapping("50%+", "hsla(279, 92.30%, 35.90%, 0.74)", 0.2);

            case "Region_Type":
                return new ColorMapping("Urban", "hsla(66, 30.30%, 60.60%, 0.76)", 0.2);

            default:
                throw new IllegalArgumentException("Unknown category: " + category);
        }
    }

    // @GetMapping("/ensemble-info")
    // public ResponseEntity<List<EnsembleInfo>> getAllEnsembleInfo() {
    //     List<EnsembleInfo> ensembleInfoList = ensembleInfoService.getAllEnsembleInfo();
    //     return ResponseEntity.ok(ensembleInfoList); // Returns the list as a response with 200 OK status
    // }
}
