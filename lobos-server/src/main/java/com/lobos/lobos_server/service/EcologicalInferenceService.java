package com.lobos.lobos_server.service;

import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.model.DataSet;

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

        Graph graph = new Graph();
        Map<String, Map<String, Object>> filterData = info.getEcologicalInference().get(filter);
        Map<String, Object> raceData = (Map<String, Object>) filterData.get(filterOption + "_Info");

        // Extract Republican and Democratic data
        Map<String, Object> republicanData = (Map<String, Object>) raceData.get("Republican");
        Map<String, Object> democraticData = (Map<String, Object>) raceData.get("Democratic");

        // Extract specific race and non-race data for both parties
        Map<String, Object> republicanRaceData = (Map<String, Object>) republicanData.get(filterOption);
        Map<String, Object> republicanNonRaceData = (Map<String, Object>) republicanData.get("Non-" + filterOption);
        Map<String, Object> democraticRaceData = (Map<String, Object>) democraticData.get(filterOption);
        Map<String, Object> democraticNonRaceData = (Map<String, Object>) democraticData.get("Non-" + filterOption);

        // Populate the graph with the retrieved data
        populateGraphWithEI(graph, filter, filterOption, republicanRaceData, republicanNonRaceData, democraticRaceData, democraticNonRaceData);

        return graph;
    }

     private void populateGraphWithEI(Graph graph, String filter, String filterOption, Map<String, Object> republicanRaceData, Map<String, Object> republicanNonRaceData, Map<String, Object> democraticRaceData, Map<String, Object> democraticNonRaceData) {
        graph.setTitle("Ecological Inference: " + filter + " - " + filterOption);
        graph.setGraphType("Line");

        // Extract PDF data for Republican (Race and Non-Race)
        DataSet republicanRaceDataSet = extractPdfData(republicanRaceData, "Republican - " + filterOption, "rgba(255, 0, 0 , 0.5)");
        DataSet republicanNonRaceDataSet = extractPdfData(republicanNonRaceData, "Republican - Non-" + filterOption, "rgba(0, 128, 0, 0.5)");

        // Extract PDF data for Democratic (Race and Non-Race)
        DataSet democraticRaceDataSet = extractPdfData(democraticRaceData, "Democratic - " + filterOption, "rgba(0, 0, 255, 0.5)");
        DataSet democraticNonRaceDataSet = extractPdfData(democraticNonRaceData, "Democratic - Non-" + filterOption, "rgba(0, 128, 0 , 0.5)");
        
        graph.setDataSets(List.of(republicanRaceDataSet, republicanNonRaceDataSet, democraticRaceDataSet, democraticNonRaceDataSet));
        List<Double> xValues = extractXValues(republicanRaceData);
        graph.setLabels(xValues.stream().map(String::valueOf).toList());
        graph.setXLabel("Support Level");
        graph.setYLabel("Probability Density");
    }

    private DataSet extractPdfData(Map<String, Object> partyData, String label, String color) {
        Map<String, Object> pdfData = (Map<String, Object>) partyData.get("pdf_data");
        List<?> rawX = (List<?>) pdfData.get("x");
        List<?> rawY = (List<?>) pdfData.get("y");

        // Convert raw x and y values to Double
        List<Double> xValues = rawX.stream().map(value -> ((Number) value).doubleValue()).toList();
        List<Double> yValues = rawY.stream().map(value -> ((Number) value).doubleValue()).toList();

        DataSet dataSet = new DataSet();
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
    return rawXValues.stream()
                     .map(value -> ((Number) value).doubleValue()) // Convert to Double
                     .toList();
    }


}