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
import java.util.HashMap;
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

    public Map<String, Object> getGraphForState(String state, String area, String filter) {
        StateInfo stateInfo = stateInfoRepository.findFirstByState(state);

        Graph graph = new Graph("Bar");
        switch (DataFiltersEnum.fromValue(filter)) {
            case PARTY:
                populatePartyData(graph, stateInfo.getData().getVoteDistribution());
                break;
            case RACE:
                populateRaceData(graph, stateInfo.getData().getRaceDistribution());
                break;
            case MINORITY:
                populateMinorityGroupData(graph, stateInfo.getData().getRaceDistribution());
                break;
            case INCOME:
                populateIncomeData(graph, stateInfo.getData().getIncomeDist(), " %");
                break;
            case REGION_TYPE:
                populateRegionData(graph, stateInfo.getData().getRegionTypeDist());
                break;
            default:
                throw new IllegalArgumentException("Invalid Filter: " + filter);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("data", graph);
        data.put("population", (stateInfo != null) ? stateInfo.getData().getTotalPopulation() : null);

        return data;
    }

    public Map<String, Object> getGraphForDistrict(String state, String area, String filter) {
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
                case MINORITY:
                    populateMinorityGroupData(graph, districtData.getRaceDistribution());
                    break;
                case INCOME:
                    populateIncomeData(graph, districtData.getIncomeDist(), "");
                    break;
                case REGION_TYPE:
                    populateRegionData(graph, districtData.getRegionTypeDist());
                    break;
                default:
                    throw new IllegalArgumentException("Invalid Filter: " + filter);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("data", graph);
        data.put("population", (districtData != null) ? districtData.getTotalPopulation() : null);

        return data;
    }

    public Map<String, Object> getGraphForPrecinct(String state, String area, String filter) {
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
                case MINORITY:
                    populateMinorityGroupData(graph, precinctData.getRaceDistribution());
                    break;
                case INCOME:
                    populateIncomeData(graph, precinctData.getIncomeDist(), "");
                    break;
                default:
                    throw new IllegalArgumentException("Invalid Filter: " + filter);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("data", graph);
        data.put("population", (precinctData != null) ? precinctData.getTotalPopulation() : null);

        return data;
    }

    private void populatePartyData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Voting Distribution");
        graph.setYLabel("Population");

        List<String> labels = List.of("Democrat", "Republican");
        List<Double> partyData = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        int democraticPopulation = (int) info.get("Democratic");
        int republicanPopulation = (int) info.get("Republican");

        partyData.add((double) democraticPopulation);
        partyData.add((double) republicanPopulation);

        GraphDataSet partyDataSet = new GraphDataSet(partyData);
        partyDataSet.setLabel("");
        partyDataSet.setBarAttributes(List.of("hsl(232, 70%, 60%)", "hsl(0, 80%, 60%)"), List.of("black"), 2);

        dataSets.add(partyDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateRaceData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Race Distribution");
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
        GraphDataSet raceDataSet = new GraphDataSet(data);
        raceDataSet.setLabel("Population by Race");
        raceDataSet.setBackgroundColor(List.of("hsl(280, 70%, 50%)"));
        raceDataSet.setBorderColor(List.of("black"));
        raceDataSet.setBorderWidth(1);

        dataSets.add(raceDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateMinorityGroupData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Minority Group Distribution");
        graph.setYLabel("Population");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        labels.add("Black");
        labels.add("Asian");
        labels.add("Hispanic or Latino");

        data.add((double) (int) info.get("Black"));
        data.add((double) (int) info.get("Asian"));
        data.add((double) (int) info.get("Hispanic or Latino"));

        // Create dataset
        GraphDataSet raceDataSet = new GraphDataSet(data);
        raceDataSet.setLabel("Population by Race");
        raceDataSet.setBackgroundColor(List.of("hsl(280, 70%, 50%)"));
        raceDataSet.setBorderColor(List.of("black"));
        raceDataSet.setBorderWidth(1);

        dataSets.add(raceDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateIncomeData(Graph graph, Map<String, Object> info, String percentString) {
        graph.setTitle("Income Distribution");
        graph.setYLabel("Population" + percentString);

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        // Loop through each income bracket
        for (String incomeBracket : info.keySet()) {
            double incomeTotal;
            if (info.get(incomeBracket) instanceof Integer)
                incomeTotal = (int) info.get(incomeBracket);
            else
                incomeTotal = (double) info.get(incomeBracket);

            // Add the bracket and percentage to labels and data
            labels.add(formatIncomeLabel(incomeBracket));
            data.add(incomeTotal);
        }

        GraphDataSet incomeDataSet = new GraphDataSet(data);
        incomeDataSet.setLabel("Income Bracket");
        incomeDataSet.setBarAttributes(List.of("hsl(120, 50%, 60%)"), List.of("black"), 1);

        dataSets.add(incomeDataSet);

        graph.setLabels(labels);
        graph.setDataSets(dataSets);
    }

    private void populateRegionData(Graph graph, Map<String, Object> info) {
        graph.setTitle("Region Type Distribution");
        graph.setYLabel("Population %");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<GraphDataSet> dataSets = new ArrayList<>();

        for (String regionType : info.keySet()) {
            if (!regionType.equalsIgnoreCase("Total")) {
                double regionPopulation = (double) info.get(regionType);

                labels.add(regionType);
                data.add((double) regionPopulation);
            }
        }

        // Create dataset
        GraphDataSet regionDataSet = new GraphDataSet(data);
        regionDataSet.setLabel("Population by Region");
        regionDataSet.setBackgroundColor(List.of("hsl(150, 75%, 40%)"));
        regionDataSet.setBorderColor(List.of("black"));
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
