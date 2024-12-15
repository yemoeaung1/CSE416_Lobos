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

    public PrecinctInfo getPrecinctInfo(String state){
        return precinctInfoRepository.findFirstByState(state);
    }

    @Cacheable(value = "precinct-info-map-cache", key = "#state")
    public Map<String, PrecinctData> fetchPrecinctInfoMap(String state){
        PrecinctInfo precinctInfo = precinctInfoRepository.findFirstByState(state);

        if(precinctInfo == null)
            return null;

        Map<String, PrecinctData> precinctInfoMap = new HashMap<>();
        for(PrecinctData obj: precinctInfo.getPrecincts()){
            precinctInfoMap.put((String) obj.getGEOID(), obj);
        }

        return precinctInfoMap;
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

                    // Calculate and add race percentages
                    int totalPopulation = precinct.getTotalPopulation();
                    if (totalPopulation > 0) {
                        filteredData.put("hispanic_percentage",
                            ((double) precinct.getHispanic() / totalPopulation) * 100);
                        filteredData.put("non_hispanic_percentage",
                            ((double) precinct.getNonHispanic() / totalPopulation) * 100);
                        filteredData.put("white_percentage",
                            ((double) precinct.getWhite() / totalPopulation) * 100);
                        filteredData.put("black_percentage",
                            ((double) precinct.getBlack() / totalPopulation) * 100);
                        filteredData.put("asian_percentage",
                            ((double) precinct.getAsian() / totalPopulation) * 100);
                    } else {
                        filteredData.put("hispanic_percentage", 0.0);
                        filteredData.put("non_hispanic_percentage", 0.0);
                        filteredData.put("white_percentage", 0.0);
                        filteredData.put("black_percentage", 0.0);
                        filteredData.put("asian_percentage", 0.0);
                    }
                    // Add region type
                    String regionType = precinct.getRegionType();
                    filteredData.put("region_type", regionType != null ? regionType : "Unknown");

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
}
