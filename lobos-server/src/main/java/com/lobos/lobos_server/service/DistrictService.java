package com.lobos.lobos_server.service;

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
    public DistrictInfo getDistrictInfo(String state){
        DistrictInfo districtInfo = districtInfoRepository.findFirstByState(state);

        return districtInfo;
    }

    @Cacheable(value = "district-plan-cache", key = "#state + #name")
    public DistrictPlanInfo getDistrictPlan(String state, String name){
        DistrictPlanInfo districtPlanInfo = districtPlanRepository.findFirstByStateAndName(state, name);

        return districtPlanInfo;
    }
}
