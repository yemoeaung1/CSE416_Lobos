package com.lobos.lobos_server.service;

import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.enum_classes.DataFiltersEnum;
import com.lobos.lobos_server.enum_classes.MapFiltersEnum;
import com.lobos.lobos_server.model.DataSet;

import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.repository.StateInfoRepository;

import com.lobos.lobos_server.model.EcologicalInferenceInfo;
import com.lobos.lobos_server.repository.GraphRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {
    private final StateInfoRepository stateInfoRepository;
    private final GraphRepository graphRepository;

    public GraphService(StateInfoRepository stateInfoRepository, GraphRepository graphRepository) {
        this.stateInfoRepository = stateInfoRepository;
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
        DataSet republicanRaceDataSet = extractPdfData(republicanRaceData, "Republican - " + filterOption, "rgba(0, 0, 255, 1)");
        DataSet republicanNonRaceDataSet = extractPdfData(republicanNonRaceData, "Republican - Non-" + filterOption, "rgba(0, 0, 128, 1)");

        // Extract PDF data for Democratic (Race and Non-Race)
        DataSet democraticRaceDataSet = extractPdfData(democraticRaceData, "Democratic - " + filterOption, "rgba(255, 0, 0, 1)");
        DataSet democraticNonRaceDataSet = extractPdfData(democraticNonRaceData, "Democratic - Non-" + filterOption, "rgba(128, 0, 0, 1)");
        
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
        List<Double> xValues = rawX.stream()
                                .map(value -> ((Number) value).doubleValue())
                                .toList();
        List<Double> yValues = rawY.stream()
                                .map(value -> ((Number) value).doubleValue())
                                .toList();

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

    //Returns the graph based on the state and the filter
    public Graph getGraphForState(String state, String filter) {
        StateInfo stateInfo = stateInfoRepository.findFirstByState(state);

        if (stateInfo == null) {
            throw new IllegalArgumentException("State not found");
        }

        Graph graph = new Graph();
        graph.setGraphType("Bar");

        DataFiltersEnum enumFilter = DataFiltersEnum.fromValue(filter);

        switch (enumFilter) {
            case PARTY:
                populatePartyData(graph, stateInfo);
                break;
            case RACE:
                populateRaceData(graph, stateInfo);
                break;
            case INCOME:
                populateIncomeData(graph, stateInfo);
                break;
            case REGION_TYPE:
                populateRegionData(graph, stateInfo);
                break;
            default:
                throw new IllegalArgumentException("Invalid Filter: " + filter);
        }
        return graph;
    }

    //Populate the data for the Race
    private void populateRaceData(Graph graph, StateInfo stateInfo) {
        graph.setTitle("Population Distribution by Race");
        graph.setXLabel("Race");
        graph.setYLabel("Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<DataSet> dataSets = new ArrayList<>();

        if (stateInfo.getStateData().containsKey("Race")) {
        Map<String, Object> raceData = (Map<String, Object>) stateInfo.getStateData().get("Race");

        for (String race : raceData.keySet()) {
            Map<String, Object> raceDetails = (Map<String, Object>) raceData.get(race);
            Object estimateObj = raceDetails.get("Estimate");

            if (estimateObj != null) {
                labels.add(race);
                data.add(Double.parseDouble(estimateObj.toString()));
            }
        }
    }

    // Create dataset
    DataSet raceDataSet = new DataSet();
    raceDataSet.setLabel("Population by Race");
    raceDataSet.setData(data);
    raceDataSet.setBackgroundColor("rgba(0, 0, 255, 0.5)");
    raceDataSet.setBorderColor("black");
    raceDataSet.setBorderWidth(1);

    dataSets.add(raceDataSet);

    graph.setLabels(labels);
    graph.setDataSets(dataSets);
    }

    //Populate the Graph with IncomeData
    private void populateIncomeData(Graph graph, StateInfo stateInfo) {
        graph.setTitle("Distribution by Income Bracket");
        graph.setXLabel("Income Bracket");
        graph.setYLabel("Percentage of Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<DataSet> dataSets = new ArrayList<>();

        if (stateInfo.getStateData().containsKey("Household Income")) {
            Map<String, Object> incomeData = (Map<String, Object>) stateInfo.getStateData().get("Household Income");

            // Loop through each income bracket
            for (String incomeBracket : incomeData.keySet()) {
                Map<String, Object> incomeDetails = (Map<String, Object>) incomeData.get(incomeBracket);

            // Add the bracket and percentage to labels and data
            labels.add(formatIncomeLabel(incomeBracket));
            data.add(Double.parseDouble(incomeDetails.get("Percentage").toString()));
        }
        }

        DataSet incomeDataSet = new DataSet();
        incomeDataSet.setLabel("Income Bracket");
        incomeDataSet.setData(data);
        incomeDataSet.setBackgroundColor("rgba(0, 255, 0, 0.5)");
        incomeDataSet.setBorderColor("black");
        incomeDataSet.setBorderWidth(1);

        dataSets.add(incomeDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    //Populate the Graph with RegionData
    private void populateRegionData(Graph graph, StateInfo stateInfo) {
        graph.setTitle("Population Distribution by Region");
        graph.setXLabel("Race");
        graph.setYLabel("Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<DataSet> dataSets = new ArrayList<>();

        if (stateInfo.getStateData().containsKey("Region Type Distribution")) {
        Map<String, Object> regionData = (Map<String, Object>) stateInfo.getStateData().get("Region Type Distribution");

        for (String regionType : regionData.keySet()) {
            Object populationObj = regionData.get(regionType);

            if (populationObj != null) {
                labels.add(regionType);
                data.add(Double.parseDouble(populationObj.toString()));
            }
        }
    }

    // Create dataset
    DataSet regionDataSet = new DataSet();
    regionDataSet.setLabel("Population by Region");
    regionDataSet.setData(data);
    regionDataSet.setBackgroundColor("rgba(0, 0, 255, 0.5)");
    regionDataSet.setBorderColor("black");
    regionDataSet.setBorderWidth(1);

    dataSets.add(regionDataSet);

    graph.setLabels(labels);
    graph.setDataSets(dataSets);
    }

    // Populate the Graph with Party Data
    private void populatePartyData(Graph graph, StateInfo stateInfo) {
    graph.setTitle("Political Party Distribution");
    graph.setXLabel("Political Party");
    graph.setYLabel("Population");

    List<String> labels = List.of("Democratic", "Republican");
    List<Double> data = new ArrayList<>();
    List<DataSet> dataSets = new ArrayList<>();

    if (stateInfo.getStateData().containsKey("Democratic") && stateInfo.getStateData().containsKey("Republican")) {
        Object democraticPopulation = stateInfo.getStateData().get("Democratic");
        Object republicanPopulation = stateInfo.getStateData().get("Republican");

        // Add population data
        data.add(Double.parseDouble(democraticPopulation.toString()));
        data.add(Double.parseDouble(republicanPopulation.toString()));
    }

    // Create dataset
    DataSet partyDataSet = new DataSet();
    partyDataSet.setLabel("Population by Political Party");
    partyDataSet.setData(data);
    partyDataSet.setBackgroundColor("rgba(255, 99, 132, 0.5)");
    partyDataSet.setBorderColor("black");
    partyDataSet.setBorderWidth(1);

    dataSets.add(partyDataSet);

    graph.setLabels(labels);
    graph.setDataSets(dataSets);
}

    private String formatIncomeLabel(String incomeBracket) {
    //Removes the '$' and ',' characters
    String cleaned = incomeBracket.replace("$", "").replace(",", "");
    if (cleaned.contains(" to ")) {
        String[] range = cleaned.split(" to ");
        if (range.length == 2) {
            try {
                // Convert numbers to 'k' format
                String lowerBound = "$" + convertToKFormat(range[0]);
                String upperBound = "$" + convertToKFormat(range[1]);
                return lowerBound + "-" + upperBound;
            } 
            catch (NumberFormatException e) {
                System.err.println("Error parsing income range: " + incomeBracket);
                return incomeBracket; 
            }
        }
    }

    // Handle "or more" case (e.g., "$200,000 or more")
    if (cleaned.contains(" or more")) {
        String base = cleaned.replace(" or more", "");
        try {
            return "$" + convertToKFormat(base) + "+";
        } catch (NumberFormatException e) {
            System.err.println("Error parsing income range: " + incomeBracket);
            return incomeBracket;
        }
    }
    return incomeBracket;
    }

    private String convertToKFormat(String value) {
        int number = Integer.parseInt(value);
        return (number / 1000) + "k";
    }
}