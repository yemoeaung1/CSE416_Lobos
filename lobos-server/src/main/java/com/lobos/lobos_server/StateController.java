package com.lobos.lobos_server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.service.StateService;
import com.lobos.lobos_server.utilities.GeoJSON;
import com.lobos.lobos_server.utilities.HeatmapMethods;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StateController {
    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping("/state-map")
    public ResponseEntity<Map<String, Object>> getStateMap(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String view,
            @RequestParam(required = false) List<String> heatmapOpts) {
                
        if(heatmapOpts != null && !heatmapOpts.isEmpty())
            view = StateViewEnum.PRECINCT.toString();
        
        Map<String, Object> data = fetchStateMap(state, view, heatmapOpts);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/state-info")
    public ResponseEntity<Map<String, Object>> getStateInfo(
            @RequestParam(required = true) String state) {

        Map<String, Object> data = fetchStateInfo(state);
        return ResponseEntity.ok(data);
    }

    @Cacheable(value = "lobosCache", key = "STATE-INFO: #state")
    private Map<String, Object> fetchStateInfo(String state){
        StateInfo stateInfo = stateService.getStateInfo(state);

        Map<String, Object> data = new HashMap<>();
        data.put("state", stateInfo.getState());
        data.put("data", stateInfo.getData());
        data.put("table", stateInfo.getTableSettings());

        return data;
    }

    @Cacheable(value = "lobosCache", key = "STATE-MAP: #state + #view")
    private Map<String, Object> fetchStateMap(String state, String view, List<String> heatmapOpts){
        StateMap stateMap = stateService.getStateMap(state, view);
        StateMapConfig stateMapConfig = stateService.getStateMapConfig(state);

        if(heatmapOpts != null && !heatmapOpts.isEmpty())
            appendHeatmapOpts(stateMap.getGeoJSON(), heatmapOpts);

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> properties = new HashMap<>();

        properties.put("CENTER", stateMapConfig.getCenter());
        properties.put("MAX_BOUNDS", stateMapConfig.getBounds());
        properties.put("CURRENT_ZOOM", stateMapConfig.getCurrZoom());
        properties.put("MIN_ZOOM", stateMapConfig.getMinZoom());
        properties.put("MAX_ZOOM", stateMapConfig.getMaxZoom());

        data.put("properties", properties);
        data.put("geoJSON", stateMap.getGeoJSON());

        return data;
    }

    private void appendHeatmapOpts(Map<String, Object> geoJSONMap, List<String> heatmapOpts){
        if(heatmapOpts != null && !heatmapOpts.isEmpty()){
            // Fetch Precinct Info from DB
            // Change Precinct Info to HashMap 
            // Add Legend
            try{
                ObjectMapper mapper = new ObjectMapper();
                String geoJSONString = mapper.writeValueAsString(geoJSONMap);
                GeoJSON geoJSON = mapper.readValue(geoJSONString, GeoJSON.class);

                for (GeoJSON.Feature feature : geoJSON.getFeatures()) {
                    Map<String, Object> colorMapping = HeatmapMethods.handleBins(heatmapOpts);

                    Map<String, Object> properties = feature.getProperties();
                    properties.put("fillColor", colorMapping.get("Color"));
                    properties.put("fillOpacity", colorMapping.get("Opacity"));
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}