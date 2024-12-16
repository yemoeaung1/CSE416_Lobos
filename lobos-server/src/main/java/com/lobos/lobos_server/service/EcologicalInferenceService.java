package com.lobos.lobos_server.service;

import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.model.GraphDataSet;

import com.lobos.lobos_server.model.EcologicalInferenceInfo;
import com.lobos.lobos_server.repository.GraphRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EcologicalInferenceService {
    private final GraphRepository graphRepository;

    public EcologicalInferenceService(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }

    public Graph getEcologicalInferenceForState(String state, String filter, String filterOption) {
        System.out.println("Entered Into this function");
         EcologicalInferenceInfo info = graphRepository.findByState(state);
        if (info == null) {
            throw new IllegalArgumentException("State not found: " + state);
        }

        Graph graph = new Graph("line");
        Map<String, Map<String, Object>> filterData = info.getEcologicalInference().get(filter);
        if (filter.equalsIgnoreCase("race")) {
            populateGraphWithFilter(graph, filter, filterData, filterOption);
        } 
        else if (filter.equalsIgnoreCase("income")) {
            populateGraphWithFilter(graph,filter, filterData, filterOption.replace(" ", "_")); // Convert "High Income" -> High_Income
        } 
        else {
            throw new IllegalArgumentException("Invalid filter: " + filter);
        }

        return graph;
    }

    private void populateGraphWithFilter(Graph graph, String filter, Map<String, Map<String, Object>> filterData, String filterOption) {
        Map<String, Object> filterInfo = (Map<String, Object>) filterData.get(filterOption + "_Info");

        if (filterInfo == null) {
            throw new IllegalArgumentException("Invalid filter option: " + filterOption);
        }

        // Extract Republican and Democratic data
        Map<String, Object> republicanData = (Map<String, Object>) filterInfo.get("Republican");
        Map<String, Object> democraticData = (Map<String, Object>) filterInfo.get("Democratic");

        // Extract specific filter and non-filter data
        Map<String, Object> republicanFilterData = (Map<String, Object>) republicanData.get(filterOption);
        Map<String, Object> republicanNonFilterData = (Map<String, Object>) republicanData.get("Non-" + filterOption);

        Map<String, Object> democraticFilterData = (Map<String, Object>) democraticData.get(filterOption);
        Map<String, Object> democraticNonFilterData = (Map<String, Object>) democraticData.get("Non-" + filterOption);

        populateGraphWithEI(graph, filter, filterOption, republicanFilterData, republicanNonFilterData, democraticFilterData, democraticNonFilterData);
    }

    private void populateGraphWithEI(Graph graph, String filter, String filterOption, Map<String, Object> republicanRaceData, Map<String, Object> republicanNonRaceData, Map<String, Object> democraticRaceData, Map<String, Object> democraticNonRaceData) {
        graph.setTitle("Ecological Inference: " + filter + " - " + filterOption);
        graph.setGraphType("Line");

        // Extract PDF data for Republican (Race and Non-Race)
        GraphDataSet republicanRaceDataSet = extractPdfData(republicanRaceData, "Republican - " + filterOption, "rgba(255, 0, 0 , 0.5)");
        GraphDataSet republicanNonRaceDataSet = extractPdfData(republicanNonRaceData, "Republican - Non-" + filterOption, "rgba(0, 128, 0, 0.5)");

        // Extract PDF data for Democratic (Race and Non-Race)
        GraphDataSet democraticRaceDataSet = extractPdfData(democraticRaceData, "Democratic - " + filterOption, "rgba(0, 0, 255, 0.5)");
        GraphDataSet democraticNonRaceDataSet = extractPdfData(democraticNonRaceData, "Democratic - Non-" + filterOption, "rgba(0, 128, 0 , 0.5)");
        
        graph.setDataSets(List.of(republicanRaceDataSet, republicanNonRaceDataSet, democraticRaceDataSet, democraticNonRaceDataSet));

        List<Double> xValues = extractXValues(republicanRaceData);
        graph.setLabels(xValues.stream().map(String::valueOf).toList());
        graph.setXLabel("Support Level");
        graph.setYLabel("Probability Density");
    }

    private GraphDataSet extractPdfData(Map<String, Object> partyData, String label, String color) {
        Map<String, Object> pdfData = (Map<String, Object>) partyData.get("pdf_data");
        List<?> rawX = (List<?>) pdfData.get("x");
        List<?> rawY = (List<?>) pdfData.get("y");

        // Convert raw x and y values to Double
        List<Double> xValues = rawX.stream().map(value -> ((Number) value).doubleValue()).toList();
        List<Double> yValues = rawY.stream().map(value -> ((Number) value).doubleValue()).toList();

        GraphDataSet dataSet = new GraphDataSet();
        dataSet.setLabel(label);
        dataSet.setData(yValues);
        dataSet.setBackgroundColor(color + "20");
        dataSet.setBorderColor(color);
        dataSet.setBorderWidth(1);

        return dataSet;
    }

    private List<Double> extractXValues(Map<String, Object> pdfData) {
    // Safely extract the "x" values from the PDF data map
    List<?> rawXValues = (List<?>) ((Map<String, Object>) pdfData.get("pdf_data")).get("x");

    // Convert to List<Double> to ensure type safety
    return rawXValues.stream().map(value -> ((Number) value).doubleValue()).toList();
    }


}