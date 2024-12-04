package com.lobos.lobos_server;

import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.PrecinctInfo;
import com.lobos.lobos_server.model.StateInfo;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.service.PrecinctService;
import com.lobos.lobos_server.service.StateService;
import com.lobos.lobos_server.utilities.ColorMapping;
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
    private final PrecinctService precinctService;

    @Autowired
    public StateController(StateService stateService, PrecinctService precinctService) {
        this.stateService = stateService;
        this.precinctService = precinctService;
    }
    @GetMapping("/precinct-data")
    public List<Map<String, Object>> getPrecinctData(@RequestParam String state) {
        return stateService.getPrecinctDataByState(state);
    }
    /* @GetMapping("/precinct-data")
    public ResponseEntity<Map<String, Object>> getPrecinctData(
            @RequestParam(required = true) String state) {

        List<Map<String,Object>> precinctDataList = stateService.getPrecinctDataByState(state);
        Map<String, Object> response = new HashMap<>();
        response.put("state", state);
        response.put("precinctData", precinctDataList);

        return ResponseEntity.ok(response);
    } */

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

    @Cacheable(value = "lobosCache", key = "'STATE-INFO:' + #state")
    private Map<String, Object> fetchStateInfo(String state){
        StateInfo stateInfo = stateService.getStateInfo(state);

        Map<String, Object> data = new HashMap<>();
        data.put("state", stateInfo.getState());
        data.put("data", stateInfo.getData());
        data.put("table", stateInfo.getTableSettings());

        return data;
    }

    private Map<String, Object> fetchStateMap(String state, String view, List<String> heatmapOpts){
        StateMapConfig stateMapConfig = stateService.getStateMapConfig(state);
        GeoJSON stateGeoJSON = fetchStateGeoJSON(state, view);
        if(heatmapOpts != null && !heatmapOpts.isEmpty())
            appendHeatmapOpts(stateGeoJSON, state, heatmapOpts);

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> properties = new HashMap<>();

        properties.put("CENTER", stateMapConfig.getCenter());
        properties.put("MAX_BOUNDS", stateMapConfig.getBounds());
        properties.put("CURRENT_ZOOM", stateMapConfig.getCurrZoom());
        properties.put("MIN_ZOOM", stateMapConfig.getMinZoom());
        properties.put("MAX_ZOOM", stateMapConfig.getMaxZoom());

        data.put("properties", properties);
        data.put("geoJSON", stateGeoJSON);

        return data;
    }

    @Cacheable(value = "lobosCache", key = "'STATE-GEOJSON:' + #state + ':' + #view")
    private GeoJSON fetchStateGeoJSON(String state, String view){
        if(!view.equals(StateViewEnum.PRECINCT.toString()))
            return stateService.getStateMap(state, view).getGeoJSON();
        else {
            // Temporary Code => Fetching Precinct Level GeoJSON Locally:
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

            return geoJSONLocal;
        }
    }

    @Cacheable(value = "lobosCache", key = "'PRECINCT-INFO-MAP:' + #state")
    private Map<String, PrecinctData> fetchPrecinctInfoMap(String state){
        PrecinctInfo precinctInfo = precinctService.getPrecinctInfo(state);
        Map<String, PrecinctData> precinctInfoMap = new HashMap<>();
        for(PrecinctData obj: precinctInfo.getPrecincts()){
            precinctInfoMap.put((String) obj.getGEOID(), obj);
        }

        return precinctInfoMap;
    }

    private void appendHeatmapOpts(GeoJSON geoJSON, String state, List<String> heatmapOpts){
        try{
            Map<String, PrecinctData> precinctInfoMap = fetchPrecinctInfoMap(state);

            // Loop through all features in GeoJSON
            for (GeoJSON.Feature feature : geoJSON.getFeatures()) {
                String key = "";
                if(feature.getProperties().get("GEOID20") instanceof String)
                    key = (String) feature.getProperties().get("GEOID20");

                PrecinctData info = precinctInfoMap.get(key);
                ColorMapping colorMapping = HeatmapMethods.handleBins(heatmapOpts, info);

                feature.getProperties().put("fillColor", colorMapping.getColor());
                feature.getProperties().put("fillOpacity", colorMapping.getOpacity());
            } 
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}