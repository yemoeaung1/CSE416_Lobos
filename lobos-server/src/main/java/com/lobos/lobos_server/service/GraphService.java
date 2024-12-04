package com.lobos.lobos_server.service;

import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.model.DataSet;

import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.repository.StateInfoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {
    private final StateInfoRepository stateInfoRepository;

    public GraphService(StateInfoRepository stateInfoRepository) {
        this.stateInfoRepository = stateInfoRepository;
    }

    //Returns the graph based on the state and the filter
    public Graph getGraphForState(String state, String filter) {
        StateInfo stateInfo = stateInfoRepository.findFirstByState(state);
        System.out.println(stateInfo);

        if (stateInfo == null) {
            throw new IllegalArgumentException("State not found");
        }

        Graph graph = new Graph();
        graph.setGraphType("Bar");

        switch (filter.toLowerCase()) {
            case "race":
                System.out.println("Populating the Race");
                populateRaceData(graph, stateInfo);
                break;
            case "income":
                System.out.println("Populating the Income");
                populateIncomeData(graph, stateInfo);
                break;
            default:
                throw new IllegalArgumentException("Invalid filter: " + filter);
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

        System.out.println("About to grab the Race data");
         if (stateInfo.getData().containsKey("Race")) {
        Map<String, Object> raceData = (Map<String, Object>) stateInfo.getData().get("Race");

        for (String race : raceData.keySet()) {
            Map<String, Object> raceDetails = (Map<String, Object>) raceData.get(race);
            Object estimateObj = raceDetails.get("Estimate");

            System.out.println(estimateObj);

            if (estimateObj != null) {
                labels.add(race);
                data.add(Double.parseDouble(estimateObj.toString())); // Ensure conversion to Double
            }
        }
    }

    // Create dataset
    DataSet raceDataSet = new DataSet();
    raceDataSet.setLabel("Population by Race");
    raceDataSet.setData(data); // Add all race data
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

        if (stateInfo.getData().containsKey("Household Income")) {
        Map<String, Object> incomeData = (Map<String, Object>) stateInfo.getData().get("Household Income");
        System.out.println(incomeData);

        // Loop through each income bracket
        for (String incomeBracket : incomeData.keySet()) {
            Map<String, Object> incomeDetails = (Map<String, Object>) incomeData.get(incomeBracket);

            // Add the bracket and percentage to labels and data
            labels.add(formatIncomeLabel(incomeBracket));
            data.add(Double.parseDouble(incomeDetails.get("Percentage").toString())); // Assuming Percentage is stored as Double
        }
        }

        DataSet incomeDataSet = new DataSet();
        incomeDataSet.setLabel("Income Bracket");
        incomeDataSet.setData(data); // Set the data for each income bracket
        incomeDataSet.setBackgroundColor("rgba(0, 255, 0, 0.5)");
        incomeDataSet.setBorderColor("black");
        incomeDataSet.setBorderWidth(1);

        dataSets.add(incomeDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    // //The color for the races
    // private String getColorForRace(String race) {
    //     switch (race) {
    //         case "White":
    //             return "rgba(255, 99, 132, 0.5)";
    //         case "Black":
    //             return "rgba(54, 162, 235, 0.5)";
    //         case "Asian":
    //             return "rgba(255, 206, 86, 0.5)";
    //         case "Hispanic":
    //             return "rgba(75, 192, 192, 0.5)";
    //         default:
    //             return "rgba(201, 203, 207, 0.5)";
    //     }
    // }

    private String formatIncomeLabel(String incomeBracket) {
    //Removes the '$' and ',' characters
    String cleaned = incomeBracket.replace("$", "").replace(",", "");

    // Split the string into ranges (e.g., "15000 to 24999")
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
            return incomeBracket; // Return original if parsing fails
        }
    }

    return incomeBracket;
}

private String convertToKFormat(String value) {
    int number = Integer.parseInt(value);
    return (number / 1000) + "k";
}
}
