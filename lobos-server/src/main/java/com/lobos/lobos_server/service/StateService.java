package com.lobos.lobos_server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.enum_classes.StatesEnum;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.repository.StateInfoRepository;
import com.lobos.lobos_server.repository.StateMapConfigRepository;
import com.lobos.lobos_server.repository.StateMapRepository;
import com.lobos.lobos_server.repository.PrecinctInfoRepository;
import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.PrecinctInfo;

@Service
public class StateService {
    private final StateInfoRepository stateInfoRepository;
    private final StateMapConfigRepository stateMapConfigRepository;
    private final StateMapRepository stateMapRepository;
    private final PrecinctInfoRepository precinctInfoRepository;

    @Autowired
    public StateService(StateInfoRepository stateInfoRepository,
                        StateMapConfigRepository stateMapConfigRepository,
                        StateMapRepository stateMapRepository,
                        PrecinctInfoRepository precinctInfoRepository) {
        this.stateInfoRepository = stateInfoRepository;
        this.stateMapRepository = stateMapRepository;
        this.stateMapConfigRepository = stateMapConfigRepository;
        this.precinctInfoRepository = precinctInfoRepository;
    }

    public StateInfo getStateInfo(String state){
        return stateInfoRepository.findFirstByState(state);
    }

    public StateMap getStateMap(String state, String view){
        if(state.equals(StatesEnum.NONE.toString()))
            return stateMapRepository.findFirstByState(state);
        else
            return stateMapRepository.findFirstByStateAndView(state, view);
    }

    public StateMapConfig getStateMapConfig(String state) {
        return stateMapConfigRepository.findFirstByState(state);
    }

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
                    filteredData.put("median_income", precinct.getMedianIncome());

                    // Calculate Democratic and Republican vote percentages
                    int demVotes = precinct.getPresD();
                    int repVotes = precinct.getPresR();
                    int totalVotes = demVotes + repVotes;

                    if (totalVotes > 0) {
                        double demPercentage = ((double) demVotes / totalVotes) * 100;
                        double repPercentage = ((double) repVotes / totalVotes) * 100;
                        filteredData.put("democrat_percentage", demPercentage);
                        filteredData.put("republican_percentage", repPercentage);
                    } else {
                        filteredData.put("democrat_percentage", 0.0);
                        filteredData.put("republican_percentage", 0.0);
                    }
                    // Add region type
                    String regionType = precinct.getRegionType();
                    filteredData.put("region_type", regionType != null ? regionType : "Unknown");

                    // Calculate race percentages and combined values
                    int totalPopulation = precinct.getTotalPopulation();
                    if (totalPopulation > 0) {
                        double hispanicPercentage = ((double) precinct.getHispanic() / totalPopulation) * 100;
                        double nonHispanicPercentage = ((double) precinct.getNonHispanic() / totalPopulation) * 100;
                        double whitePercentage = ((double) precinct.getWhite() / totalPopulation) * 100;
                        double blackPercentage = ((double) precinct.getBlack() / totalPopulation) * 100;
                        double asianPercentage = ((double) precinct.getAsian() / totalPopulation) * 100;
    
                        // Add regular race percentages for the Race tab
                        filteredData.put("hispanic_percentage", hispanicPercentage);
                        filteredData.put("non_hispanic_percentage", nonHispanicPercentage);
                        filteredData.put("white_percentage", whitePercentage);
                        filteredData.put("black_percentage", blackPercentage);
                        filteredData.put("asian_percentage", asianPercentage);
    
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
    
                        filteredData.put("combined_hispanic", 0.0);
                        filteredData.put("combined_non_hispanic", 0.0);
                        filteredData.put("combined_white", 0.0);
                        filteredData.put("combined_black", 0.0);
                        filteredData.put("combined_asian", 0.0);
                    }

                    filteredPrecinctData.add(filteredData);
                }
                int hispanicCount = 0, nonHispanicCount = 0, whiteCount = 0, blackCount = 0, asianCount = 0;

                for (Map<String, Object> precinct : filteredPrecinctData) {
                    if ((double) precinct.get("combined_hispanic") > 1) hispanicCount++;
                    if ((double) precinct.get("combined_non_hispanic") > 1) nonHispanicCount++;
                    if ((double) precinct.get("combined_white") > 1) whiteCount++;
                    if ((double) precinct.get("combined_black") > 1) blackCount++;
                    if ((double) precinct.get("combined_asian") > 1) asianCount++;
                }

                System.out.println("Hispanic: " + hispanicCount);
                System.out.println("Non-Hispanic: " + nonHispanicCount);
                System.out.println("White: " + whiteCount);
                System.out.println("Black: " + blackCount);
                System.out.println("Asian: " + asianCount);

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
