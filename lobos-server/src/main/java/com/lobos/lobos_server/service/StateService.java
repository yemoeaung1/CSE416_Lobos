package com.lobos.lobos_server.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.enum_classes.StatesEnum;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.repository.StateInfoRepository;
import com.lobos.lobos_server.repository.StateMapConfigRepository;
import com.lobos.lobos_server.repository.StateMapRepository;
import com.lobos.lobos_server.utilities.GeoJSON;

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

    @Cacheable(value = "state-info-cache", key = "#state")
    public Map<String, Object> getStateInfo(String state){
        StateInfo stateInfo = stateInfoRepository.findFirstByState(state);

        Map<String, Object> data = new HashMap<>();
        data.put("state", stateInfo.getState());
        data.put("data", stateInfo.getData());

        return data;
    }

    @Cacheable(value = "state-map-cache", key = "#state + '-' + #view")
    public GeoJSON getStateMap(String state, String view){
        if(state.equals(StatesEnum.NONE.toString()))
            return stateMapRepository.findFirstByState(state).getGeoJSON();
        else
            return stateMapRepository.findFirstByStateAndView(state, view).getGeoJSON();
    }
    
    @Cacheable(value = "state-map-config-cache", key = "#state")
    public StateMapConfig getStateMapConfig(String state) {
        return stateMapConfigRepository.findFirstByState(state);
    }
}
