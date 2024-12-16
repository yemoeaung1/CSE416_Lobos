package com.lobos.lobos_server.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.DistrictInfo;
import com.lobos.lobos_server.model.DistrictPlanInfo;
import com.lobos.lobos_server.repository.DistrictInfoRepository;
import com.lobos.lobos_server.repository.DistrictPlanRepository;

@Service
public class DistrictService {
    private final DistrictInfoRepository districtInfoRepository;
    private final DistrictPlanRepository districtPlanRepository;

    @Autowired
    public DistrictService(DistrictInfoRepository districtInfoRepository, DistrictPlanRepository districtPlanRepository) {
        this.districtInfoRepository = districtInfoRepository;
        this.districtPlanRepository = districtPlanRepository;
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

    @Cacheable(value = "district-plan-cache", key = "#state + #name")
    public Map<String, Object> getDistrictPlan(String state, String name){
        DistrictPlanInfo districtPlanInfo = districtPlanRepository.findFirstByStateAndName(state, name);

        Map<String, Object> data = new HashMap<>();
        data.put("data", districtPlanInfo.getData());
        data.put("geoJSON", districtPlanInfo.getGeoJSON());
        data.put("properties", districtPlanInfo.getProperties());

        return data;
    }
}
