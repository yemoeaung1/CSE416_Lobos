package com.lobos.lobos_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.enum_classes.StatesEnum;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.repository.StateInfoRepository;
import com.lobos.lobos_server.repository.StateMapConfigRepository;
import com.lobos.lobos_server.repository.StateMapRepository;

@Service
public class StateService {
    private final StateInfoRepository stateInfoRepository;
    private final StateMapConfigRepository stateMapConfigRepository;
    private final StateMapRepository stateMapRepository;

    @Autowired
    public StateService(StateInfoRepository stateInfoRepository,
                        StateMapConfigRepository stateMapConfigRepository,
                        StateMapRepository stateMapRepository) {
        this.stateInfoRepository = stateInfoRepository;
        this.stateMapRepository = stateMapRepository;
        this.stateMapConfigRepository = stateMapConfigRepository;
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
}
