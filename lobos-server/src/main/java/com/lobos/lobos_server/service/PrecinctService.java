package com.lobos.lobos_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
