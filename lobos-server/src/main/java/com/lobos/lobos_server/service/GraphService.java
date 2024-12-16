package com.lobos.lobos_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.DistrictData;
import com.lobos.lobos_server.model.DistrictInfo;
import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.enum_classes.DataFiltersEnum;
import com.lobos.lobos_server.model.GraphDataSet;
import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.repository.DistrictInfoRepository;
import com.lobos.lobos_server.repository.StateInfoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {
    private final StateInfoRepository stateInfoRepository;
    private final DistrictInfoRepository districtInfoRepository;
    private final PrecinctService precinctService;

    @Autowired
    public GraphService(StateInfoRepository stateInfoRepository,
            DistrictInfoRepository districtInfoRepository,
            PrecinctService precinctService) {

        this.stateInfoRepository = stateInfoRepository;
        this.districtInfoRepository = districtInfoRepository;
        this.precinctService = precinctService;
    }

    public Graph getGraphForState(String state, String area, String filter) {
        StateInfo stateInfo = stateInfoRepository.findFirstByState(state);

        Graph graph = new Graph("Bar");
        switch (DataFiltersEnum.fromValue(filter)) {
            case PARTY:
                populatePartyData(graph, stateInfo.getData().getVoteDistribution());
                break;
            case RACE:
                populateRaceData(graph, stateInfo.getData().getRaceDistribution());
                break;
            case INCOME:
                populateIncomeData(graph, stateInfo.getData().getIncomeDist());
                break;
            case REGION_TYPE:
                populateRegionData(graph, stateInfo.getData().getRegionTypeDist());
                break;
            default:
                throw new IllegalArgumentException("Invalid Filter: " + filter);
        }

        return graph;
    }

    public Graph getGraphForDistrict(String state, String area, String filter) {
        DistrictInfo districtInfo = districtInfoRepository.findFirstByState(state);
        DistrictData districtData = null;

        for (DistrictData data : districtInfo.getDistricts()) {
            if (data.getName().equals(area))
                districtData = data;
        }

        Graph graph = new Graph("Bar");
        if (districtData != null) {
            switch (DataFiltersEnum.fromValue(filter)) {
                case PARTY:
                    populatePartyData(graph, districtData.getVoteDistribution());
                    break;
                case RACE:
                    populateRaceData(graph, districtData.getRaceDistribution());
                    break;
                case INCOME:
                    populateIncomeData(graph, districtData.getIncomeDist());
                    break;
                default:
                    throw new IllegalArgumentException("Invalid Filter: " + filter);
            }
        }

        return graph;
    }

    public Graph getGraphForPrecinct(String state, String area, String filter) {
        PrecinctData precinctData = null;

        Map<String, PrecinctData> precinctMap = precinctService.fetchPrecinctInfoMapByName(state);
        precinctData = precinctMap.get(area);

        Graph graph = new Graph("Bar");
        if (precinctData != null) {
            switch (DataFiltersEnum.fromValue(filter)) {
                case PARTY:
                    populatePartyData(graph, precinctData.getVoteDistribution());
                    break;
                case RACE:
                    populateRaceData(graph, precinctData.getRaceDistribution());
                    break;
                case INCOME:
                    populateIncomeData(graph, precinctData.getIncomeDist());
                    break;
                default:
                    throw new IllegalArgumentException("Invalid Filter: " + filter);
            }
        }

        return graph;
    }

    private void populatePartyData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Political Party Distribution");
        graph.setXLabel("Political Party");
        graph.setYLabel("Population");

        List<String> labels = List.of("Democrat", "Republican");
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        int democraticPopulation = (int) info.get("Democratic");
        int republicanPopulation = (int) info.get("Republican");

        // Add population data
        data.add((double) democraticPopulation);
        data.add((double) republicanPopulation);

        // Create dataset
        GraphDataSet partyDataSet = new GraphDataSet();
        partyDataSet.setLabel("Population by Political Party");
        partyDataSet.setData(data);
        partyDataSet.setBackgroundColor("rgba(255, 99, 132, 0.5)");
        partyDataSet.setBorderColor("black");
        partyDataSet.setBorderWidth(1);

        dataSets.add(partyDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateRaceData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Population Distribution by Race");
        graph.setXLabel("Race");
        graph.setYLabel("Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        for (String race : info.keySet()) {
            int raceCount = (int) info.get(race);

            labels.add(race);
            data.add((double) raceCount);
        }

        // Create dataset
        GraphDataSet raceDataSet = new GraphDataSet();
        raceDataSet.setLabel("Population by Race");
        raceDataSet.setData(data);
        raceDataSet.setBackgroundColor("rgba(0, 0, 255, 0.5)");
        raceDataSet.setBorderColor("black");
        raceDataSet.setBorderWidth(1);

        dataSets.add(raceDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateIncomeData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Distribution by Income Bracket");
        graph.setXLabel("Income Bracket");
        graph.setYLabel("Percentage of Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        // Loop through each income bracket
        for (String incomeBracket : info.keySet()) {
            double incomeTotal;
            if(info.get(incomeBracket) instanceof Integer)
                incomeTotal = (int) info.get(incomeBracket);
            else
                incomeTotal = (double) info.get(incomeBracket);

            // Add the bracket and percentage to labels and data
            labels.add(formatIncomeLabel(incomeBracket));
            data.add(incomeTotal);
        }

        GraphDataSet incomeDataSet = new GraphDataSet();
        incomeDataSet.setLabel("Income Bracket");
        incomeDataSet.setData(data);
        incomeDataSet.setBackgroundColor("rgba(0, 255, 0, 0.5)");
        incomeDataSet.setBorderColor("black");
        incomeDataSet.setBorderWidth(1);

        dataSets.add(incomeDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateRegionData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Population Distribution by Region");
        graph.setXLabel("Region Type");
        graph.setYLabel("Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        for (String regionType : info.keySet()) {
            int regionPopulation = (int) info.get(regionType);

            labels.add(regionType);
            data.add((double) regionPopulation);
        }
        
        // Create dataset
        GraphDataSet regionDataSet = new GraphDataSet();
        regionDataSet.setLabel("Population by Region");
        regionDataSet.setData(data);
        regionDataSet.setBackgroundColor("rgba(0, 0, 255, 0.5)");
        regionDataSet.setBorderColor("black");
        regionDataSet.setBorderWidth(1);

        dataSets.add(regionDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private String formatIncomeLabel(String incomeBracket) {
        // Removes the '$' and ',' characters
        String cleaned = incomeBracket.replace("$", "").replace(",", "");
        if (cleaned.contains(" to ")) {
            String[] range = cleaned.split(" to ");
            if (range.length == 2) {
                try {
                    // Convert numbers to 'k' format
                    String lowerBound = "$" + convertToKFormat(range[0]);
                    String upperBound = "$" + convertToKFormat(range[1]);
                    return lowerBound + "-" + upperBound;
                } catch (NumberFormatException e) {
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
