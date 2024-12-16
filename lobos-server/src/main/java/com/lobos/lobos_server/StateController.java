package com.lobos.lobos_server;

import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.service.PrecinctService;
import com.lobos.lobos_server.service.StateService;
import com.lobos.lobos_server.utilities.ColorMapping;
import com.lobos.lobos_server.utilities.GeoJSON;
import com.lobos.lobos_server.utilities.HeatmapMethods;

import java.util.ArrayList;
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
            @RequestParam(required = true) List<String> heatmapOpts) {
        
        if(state.equals(StatesEnum.NONE.toString()) || view.equals(MapViewsEnum.NONE.toString())){
            state = StatesEnum.NONE.toString();
            view = MapViewsEnum.NONE.toString();
        }
        
        Map<String, Object> data = fetchStateMap(state, view, heatmapOpts);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/state-info")
    public ResponseEntity<Map<String, Object>> getStateInfo(
            @RequestParam(required = true) String state) {

        Map<String, Object> data = stateService.getStateInfo(state);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/state-map-legend")
    public ResponseEntity<ArrayList<ColorMapping>> getStateMapLegend(@RequestParam(required = true) List<String> heatmapOpts) {
        ArrayList<ColorMapping> data = HeatmapMethods.getBins(heatmapOpts);
        return ResponseEntity.ok(data);
    }

    private Map<String, Object> fetchStateMap(String state, String view, List<String> heatmapOpts){
        StateMapConfig stateMapConfig = stateService.getStateMapConfig(state);
        GeoJSON stateGeoJSON = stateService.getStateMap(state, view);
        
        if(view.equals(MapViewsEnum.PRECINCT.toString()))
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

    private void appendHeatmapOpts(GeoJSON geoJSON, String state, List<String> heatmapOpts){
        try{
            Map<String, PrecinctData> precinctInfoMap = precinctService.fetchPrecinctInfoMapByGEOID(state);

            // Loop through all features in GeoJSON
            for (GeoJSON.Feature feature : geoJSON.getFeatures()) {
                String key = "";
                if(feature.getProperties().get("GEOID20") instanceof String)
                    key = (String) feature.getProperties().get("GEOID20");

                ColorMapping colorMapping;
                if(precinctInfoMap == null)
                    colorMapping = HeatmapMethods.handleBins(heatmapOpts, null);
                else
                    colorMapping = HeatmapMethods.handleBins(heatmapOpts, precinctInfoMap.get(key));

                feature.getProperties().put("FCOLOR", colorMapping.getColor());
                feature.getProperties().put("FOPACITY", colorMapping.getOpacity());
            } 
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}