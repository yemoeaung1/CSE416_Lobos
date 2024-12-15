package com.lobos.lobos_server.service;

import java.util.HashMap;
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
}
