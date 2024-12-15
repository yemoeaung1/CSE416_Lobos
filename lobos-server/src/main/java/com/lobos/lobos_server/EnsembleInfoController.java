package com.lobos.lobos_server;

import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.service.EnsembleInfoService;
import com.lobos.lobos_server.model.Boxplot;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EnsembleInfoController {
    private final EnsembleInfoService ensembleInfoService;

    @Autowired
    public EnsembleInfoController(EnsembleInfoService ensembleInfoService) {
        this.ensembleInfoService = ensembleInfoService;
    }

    @GetMapping("/ensemble-info")
    public EnsembleInfo getEnsembleInfo(@RequestParam String state) {
        // Map<String, Object> data = getBoxandWhiskerData(state, "white");
        return ensembleInfoService.getEnsembleInfoForState(state);
    }

    @GetMapping("/ensemble-data")
    public ResponseEntity<Map<String, Object>> showSortedBox(String state, String filter) {
        Map<String, Boxplot> sortedDistricts = getBoxandWhiskerData(state, filter);
        Map<String, Object> data = formatBoxplotData(sortedDistricts);
        return ResponseEntity.ok(data);
    }

    private Map<String, Boxplot> getBoxandWhiskerData(String state, String filter) {
        // Retrieve the EnsembleInfo object
        EnsembleInfo ensembleInfo = ensembleInfoService.getEnsembleInfoForState(state);

        // Get the Boxplot map from the EnsembleInfo using the filter
        Map<String, Map<String, Boxplot>> boxplot = ensembleInfo.getBoxplot();

        if(filter.equals("poverty_rate")) {
            filter = "households_below_poverty_line";
        }
        Map<String, Boxplot> districtData = boxplot.get(filter);

        List<Map.Entry<String, Boxplot>> sortedDistricts = new ArrayList<>(districtData.entrySet());
        sortedDistricts.sort(Comparator.comparing(entry -> entry.getValue().getMedian()));

        // for (Map.Entry<String, Boxplot> district : sortedDistricts) {
        //     System.out.println("  Inner Key: " + district.getKey());  // Inner map key
        //     Boxplot boxplotObj = district.getValue();
            
        //     // Retrieve and print the median
        //     Double median = boxplotObj.getMedian();
        //     System.out.println("Median: " + median);
        // }

        Map<String, Boxplot> sortedDistrictMap = new LinkedHashMap<>();
            // Iterate through the sorted list and populate the new map
        for (Map.Entry<String, Boxplot> district : sortedDistricts) {
            sortedDistrictMap.put(district.getKey(), district.getValue());
        }

        return sortedDistrictMap;
    }

    private Map<String, Object> formatBoxplotData(Map<String, Boxplot> sortedDistricts) {
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
        dataSet.put("label", "Recom Ensemble (5000 plans)");
        dataSet.put("backgroundColor", "rgba(0,0,255,0.5)");
        dataSet.put("borderColor", "blue");
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
        result.put("title", "Ensemble Analysis");

        return result;
    }

    // @GetMapping("/ensemble-info")
    // public ResponseEntity<List<EnsembleInfo>> getAllEnsembleInfo() {
    //     List<EnsembleInfo> ensembleInfoList = ensembleInfoService.getAllEnsembleInfo();
    //     return ResponseEntity.ok(ensembleInfoList); // Returns the list as a response with 200 OK status
    // }
}