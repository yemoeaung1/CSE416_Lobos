package com.lobos.lobos_server.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.DistrictInfo;
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
        data.put("data", districtInfo.getData());

        return data;
    }
}
