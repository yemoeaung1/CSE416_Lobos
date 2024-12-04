package com.lobos.lobos_server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        Optional<PrecinctInfo> precinctInfo = precinctInfoRepository.findFirstByState(state);

        if (precinctInfo.isPresent()) {
            List<Map<String, Object>> precincts = precinctInfo.get().getPrecincts();

            if (precincts == null || precincts.isEmpty()) {
                System.out.println("No precinct data found for state: " + state);
                return Collections.emptyList();
            } else {
                List<Map<String, Object>> filteredPrecinctData = new ArrayList<>();

                // Extract necessary fields from each precinct
                for (Map<String, Object> precinct : precincts) {
                    Map<String, Object> filteredData = new HashMap<>();
                    filteredData.put("median_income", precinct.get("median_income"));

                    // Calculate Democratic and Republican vote percentages
                    int demVotes = (int) precinct.getOrDefault("2020_PRES_D", 0);
                    int repVotes = (int) precinct.getOrDefault("2020_PRES_R", 0);
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

                    filteredPrecinctData.add(filteredData);
                }

                System.out.println("Filtered data for state: " + state + " is ready.");
                return filteredPrecinctData;
            }
        } else {
            System.out.println("No data found for state: " + state);
            return Collections.emptyList();
        }
    }
    
}
