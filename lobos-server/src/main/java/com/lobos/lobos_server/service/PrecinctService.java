package com.lobos.lobos_server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.PrecinctInfo;
import com.lobos.lobos_server.repository.PrecinctInfoRepository;

@Service
public class PrecinctService {
    private final PrecinctInfoRepository precinctInfoRepository;

    @Autowired
    public PrecinctService(PrecinctInfoRepository precinctInfoRepository) {
        this.precinctInfoRepository = precinctInfoRepository;
    }

    @Cacheable(value = "precinct-info-cache", key = "#state")
    public PrecinctInfo getPrecinctInfo(String state){
        return precinctInfoRepository.findFirstByState(state);
    }

    @Cacheable(value = "precinct-info-map-geoid-cache", key = "#state")
    public Map<String, PrecinctData> fetchPrecinctInfoMapByGEOID(String state){
        PrecinctInfo precinctInfo = precinctInfoRepository.findFirstByState(state);

        if(precinctInfo == null)
            return null;

        Map<String, PrecinctData> precinctInfoMap = new HashMap<>();
        for(PrecinctData obj: precinctInfo.getPrecincts()){
            precinctInfoMap.put((String) obj.getGEOID(), obj);
        }

        return precinctInfoMap;
    }

    @Cacheable(value = "precinct-info-map-name-cache", key = "#state")
    public Map<String, PrecinctData> fetchPrecinctInfoMapByName(String state){
        PrecinctInfo precinctInfo = precinctInfoRepository.findFirstByState(state);

        if(precinctInfo == null)
            return null;

        Map<String, PrecinctData> precinctInfoMap = new HashMap<>();
        for(PrecinctData obj: precinctInfo.getPrecincts()){
            precinctInfoMap.put((String) obj.getName(), obj);
        }

        return precinctInfoMap;
    }
    
    @Cacheable(value = "precinct-data-cache", key = "#state")
    public List<Map<String, Object>> getPrecinctDataByState(String state) {
        PrecinctInfo precinctInfo = precinctInfoRepository.findFirstByState(state);

        if (precinctInfo != null) {
            PrecinctData[] precincts = precinctInfo.getPrecincts();

            if (precincts == null || precincts.length == 0) {
                System.out.println("No precinct data found for state: " + state);
                return Collections.emptyList();
            } else {
                List<Map<String, Object>> filteredPrecinctData = new ArrayList<>();

                // Extract necessary fields from each precinct
                for (PrecinctData precinct : precincts) {
                    Map<String, Object> filteredData = new HashMap<>();
                    filteredData.put("geoid", precinct.getGEOID());
                    filteredData.put("median_income", precinct.getMedianIncome());

                    // Calculate Democratic and Republican vote percentages
                    int demVotes = (int) precinct.getVoteDistribution().get("Democratic");
                    int repVotes = (int) precinct.getVoteDistribution().get("Republican");
                    int totalVotes = demVotes + repVotes;
                    
                    if (totalVotes > 0) {
                        double demPercentage = ((double) demVotes / totalVotes) * 100;
                        double repPercentage = ((double) repVotes / totalVotes) * 100;
                        filteredData.put("democrat_percentage", demPercentage);
                        filteredData.put("republican_percentage", repPercentage);
                        filteredData.put("democrat_votes", demVotes);
                        filteredData.put("republican_votes", repVotes);
                        filteredData.put("total_votes", totalVotes);
                    } else {
                        filteredData.put("democrat_percentage", 0.0);
                        filteredData.put("republican_percentage", 0.0);
                        filteredData.put("democrat_votes", 0.0);
                        filteredData.put("republican_votes", 0.0);
                        filteredData.put("total_votes", 0.0);
                    }
                    // Add region type
                    String regionType = precinct.getRegionType();
                    filteredData.put("region_type", regionType != null ? regionType : "Unknown");

                    // Calculate race percentages and combined values
                    int totalPopulation = precinct.getTotalPopulation();
                    if (totalPopulation > 0) {
                        filteredData.put("total_population", totalPopulation);
                        int nonWhite = totalPopulation - ((int) precinct.getRaceDistribution().get("White"));
                        double hispanicPercentage = ((double) ((int) precinct.getRaceDistribution().get("Hispanic or Latino")) / totalPopulation) * 100;
                        double nonHispanicPercentage = ((double) ((int) precinct.getRaceDistribution().get("Non-Hispanic")) / totalPopulation) * 100;
                        double whitePercentage = ((double) ((int) precinct.getRaceDistribution().get("White")) / totalPopulation) * 100;
                        double blackPercentage = ((double) ((int) precinct.getRaceDistribution().get("Black")) / totalPopulation) * 100;
                        double asianPercentage = ((double) ((int) precinct.getRaceDistribution().get("Asian")) / totalPopulation) * 100;
    
                        // Add regular race percentages for the Race tab
                        filteredData.put("hispanic_percentage", hispanicPercentage);
                        filteredData.put("non_hispanic_percentage", nonHispanicPercentage);
                        filteredData.put("white_percentage", whitePercentage);
                        filteredData.put("black_percentage", blackPercentage);
                        filteredData.put("asian_percentage", asianPercentage);
                        filteredData.put("non_white", nonWhite);

                        // Add combined values for each race
                        filteredData.put("combined_hispanic", calculateCombinedValue(precinct.getMedianIncome(), hispanicPercentage));
                        filteredData.put("combined_non_hispanic", calculateCombinedValue(precinct.getMedianIncome(), nonHispanicPercentage));
                        filteredData.put("combined_white", calculateCombinedValue(precinct.getMedianIncome(), whitePercentage));
                        filteredData.put("combined_black", calculateCombinedValue(precinct.getMedianIncome(), blackPercentage));
                        filteredData.put("combined_asian", calculateCombinedValue(precinct.getMedianIncome(), asianPercentage));
                    } else {
                        // Default to 0 if total population is missing or zero
                        filteredData.put("hispanic_percentage", 0.0);
                        filteredData.put("non_hispanic_percentage", 0.0);
                        filteredData.put("white_percentage", 0.0);
                        filteredData.put("black_percentage", 0.0);
                        filteredData.put("asian_percentage", 0.0);
                        filteredData.put("non_white", 0.0);
                        filteredData.put("total_population", 0.0);

                        filteredData.put("combined_hispanic", 0.0);
                        filteredData.put("combined_non_hispanic", 0.0);
                        filteredData.put("combined_white", 0.0);
                        filteredData.put("combined_black", 0.0);
                        filteredData.put("combined_asian", 0.0);
                    }

                    filteredPrecinctData.add(filteredData);
                }

                // Log the filtered data
                // System.out.println("Filtered data for state: " + state + ": " + filteredPrecinctData);
                System.out.println("Filtered data for state: " + state + " is ready.");
                return filteredPrecinctData;
            }
        } else {
            System.out.println("No data found for state: " + state);
            return Collections.emptyList();
        }
    }
    // Helper method to calculate the combined value
    private double calculateCombinedValue(double medianIncome, double racePercentage) {
        // Check if racePercentage is 0 or invalid
        if (racePercentage <= 0) {
            return 0; // Skip normalization and return 0 if racePercentage is invalid
        }
    
        // Check if medianIncome is invalid
        if (medianIncome <= 0) {
            System.out.println("Invalid median income, skipping normalization.");
            return 0; // Return 0 if income is invalid
        }
    
        // Normalize income for scaling
        double normalizedIncome = medianIncome / 1000.0;
    
        // Return the linear combination of normalized income and race percentage
        return (0.5 * normalizedIncome) + (0.5 * racePercentage);
    }
}
