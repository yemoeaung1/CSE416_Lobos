package com.lobos.lobos_server;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.PrecinctInfo;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.service.PrecinctService;
import com.lobos.lobos_server.service.StateService;
import com.lobos.lobos_server.utilities.GeoJSON;
import com.lobos.lobos_server.utilities.HeatmapMethods;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StateController {
    private final StateService stateService;
    private final PrecinctService precinctService;

    @Autowired
    public StateController(StateService stateService, PrecinctService precinctService) {
        this.stateService = stateService;
        this.precinctService = precinctService;
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

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> properties = new HashMap<>();

        properties.put("CENTER", stateMapConfig.getCenter());
        properties.put("MAX_BOUNDS", stateMapConfig.getBounds());
        properties.put("CURRENT_ZOOM", stateMapConfig.getCurrZoom());
        properties.put("MIN_ZOOM", stateMapConfig.getMinZoom());
        properties.put("MAX_ZOOM", stateMapConfig.getMaxZoom());

        data.put("properties", properties);

        // Temporary Code => Fetching Precinct Level GeoJSON Locally:
        if(view.equals(StateViewEnum.PRECINCT.toString())){
            GeoJSON geoJSONLocal = null;
            try {
                if(state.equals("South Carolina")){
                    geoJSONLocal = GeoJSON.parseGeoJsonAsMap("sc_vtd_boundary.geojson");
                }
                else if(state.equals("Utah")){
                    geoJSONLocal = GeoJSON.parseGeoJsonAsMap("ut_vtd_boundary.geojson");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            
            if(heatmapOpts != null && !heatmapOpts.isEmpty())
                appendHeatmapOpts(geoJSONLocal, state, heatmapOpts);
            
            data.put("geoJSON", geoJSONLocal);
        } else {
            if(heatmapOpts != null && !heatmapOpts.isEmpty())
                appendHeatmapOpts(stateMap.getGeoJSON(), state, heatmapOpts);
                
            data.put("geoJSON", stateMap.getGeoJSON());
        }

        return data;
    }

    private void appendHeatmapOpts(GeoJSON geoJSON, String state, List<String> heatmapOpts){
        try{
            // Fetch precinct info and convert into HashMap
            PrecinctInfo precinctInfo = precinctService.getPrecinctInfo(state);
            Map<String, Object> precinctInfoMap = new HashMap<>();
            for(Map<String, Object> obj: precinctInfo.getPrecincts()){
                if(obj.get("GEOID20") != null && obj.get("GEOID20") instanceof String){
                    precinctInfoMap.put((String) obj.get("GEOID20"), obj);
                }
            }

            // Loop through all features in GeoJSON
            for (GeoJSON.Feature feature : geoJSON.getFeatures()) {
                String key = "";
                if(feature.getProperties().get("GEOID20") instanceof String)
                    key = (String) feature.getProperties().get("GEOID20");

                Object info = precinctInfoMap.get(key);
                Map<String, Object> colorMapping = HeatmapMethods.handleBins(heatmapOpts, info);

                feature.getProperties().put("fillColor", colorMapping.get("Color"));
                feature.getProperties().put("fillOpacity", colorMapping.get("Opacity"));
            } 
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}