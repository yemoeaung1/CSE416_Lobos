package com.lobos.lobos_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.repository.StateMapConfigRepository;
import com.lobos.lobos_server.repository.StateMapRepository;

@Service
public class StateService {
    private final StateMapConfigRepository stateMapConfigRepository;
    private final StateMapRepository stateMapRepository;

    @Autowired
    public StateService(StateMapConfigRepository stateMapConfigRepository, StateMapRepository stateMapRepository) {
        this.stateMapRepository = stateMapRepository;
        this.stateMapConfigRepository = stateMapConfigRepository;
    }

    public StateMap getStateMap(String state, String view){
        System.out.println("SERVICE GET MAP: " + stateMapRepository.findFirstByStateAndView(state, view));
        return stateMapRepository.findFirstByStateAndView(state, view);
    }

    public StateMapConfig getStateMapConfig(String state) {
        return stateMapConfigRepository.findFirstByState(state);
    }
}
