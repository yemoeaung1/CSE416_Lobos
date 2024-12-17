package com.lobos.lobos_server.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.DistrictInfo;
import com.lobos.lobos_server.model.DistrictData;
import com.lobos.lobos_server.repository.DistrictInfoRepository;

@Service
public class DistrictService {
    private final DistrictInfoRepository districtInfoRepository;

    @Autowired
    public DistrictService(DistrictInfoRepository districtInfoRepository) {
        this.districtInfoRepository = districtInfoRepository;
    }

    @Cacheable(value = "district-info-cache", key = "#state")
    public Map<String, Object> getDistrictInfo(String state){
        DistrictInfo districtInfo = districtInfoRepository.findFirstByState(state);

        Map<String, Object> data = new HashMap<>();
        data.put("state", districtInfo.getState());
        data.put("data", districtInfo.getDistricts());
        data.put("representativeData", districtInfo.getRepresentativeData());

        return data;
    }
    
    public List<Map<String, Object>> getVoteShareSeatShareCurve(String state) {
        // Fetch the district info
        DistrictInfo districtInfo = districtInfoRepository.findFirstByState(state);

        if (districtInfo == null) {
            System.out.println("No data found for state: " + state);
            return Collections.emptyList();
        }

        DistrictData[] districts = districtInfo.getDistricts();
        if (districts == null || districts.length == 0) {
            System.out.println("No district data found for state: " + state);
            return Collections.emptyList();
        }

        // Process data to calculate vote share and seat share
        List<Map<String, Object>> voteSeatCurve = new ArrayList<>();
        int totalRepublicanVotes = 0;
        int totalDemocraticVotes = 0;

        // Calculate total votes for all districts
        for (DistrictData district : districts) {
            Map<String, Object> voteDist = district.getVoteDistribution();
            totalRepublicanVotes += (int) voteDist.getOrDefault("Republican", 0);
            totalDemocraticVotes += (int) voteDist.getOrDefault("Democratic", 0);
        }

        int totalSeats = districts.length;

        // Iterate through districts to calculate vote share and seat share
        int republicanSeatsWon = 0;
        int democraticSeatsWon = 0;

        for (DistrictData district : districts) {
            Map<String, Object> voteDist = district.getVoteDistribution();
            int republicanVotes = (int) voteDist.getOrDefault("Republican", 0);
            int democraticVotes = (int) voteDist.getOrDefault("Democratic", 0);

            double republicanVoteShare = (double) republicanVotes / (republicanVotes + democraticVotes) * 100;
            double democraticVoteShare = 100 - republicanVoteShare;

            // Determine seat winners
            if (republicanVotes > democraticVotes) {
                republicanSeatsWon++;
            } else {
                democraticSeatsWon++;
            }

            // Prepare data point for this district
            Map<String, Object> curvePoint = new HashMap<>();
            curvePoint.put("district", district.getName());
            curvePoint.put("republican_vote_share", republicanVoteShare);
            curvePoint.put("democratic_vote_share", democraticVoteShare);
            curvePoint.put("republican_seat_share", (double) republicanSeatsWon / totalSeats * 100);
            curvePoint.put("democratic_seat_share", (double) democraticSeatsWon / totalSeats * 100);

            voteSeatCurve.add(curvePoint);
        }

        return voteSeatCurve;
    }
}
