package com.lobos.lobos_server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.StateMap;
import com.lobos.lobos_server.model.StateMapConfig;
import com.lobos.lobos_server.service.StateService;

import java.util.HashMap;
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

    @Cacheable(value = "lobosCache", key = "#state + #view")
    @GetMapping("/state-map")
    public ResponseEntity<Map<String, Object>> getStateMap(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String view) {

        StateMap stateMap = stateService.getStateMap(state, view);
        StateMapConfig stateMapConfig = stateService.getStateMapConfig(state);

        System.out.println("MAP: " + stateMap);
        System.out.println("CONFIG: " + stateMapConfig);

        Map<String, Object> data = new HashMap<>();
        Map<String, Object> properties = new HashMap<>();

        properties.put("CENTER", stateMapConfig.getCenter());
        properties.put("MAX_BOUNDS", stateMapConfig.getBounds());
        properties.put("CURRENT_ZOOM", stateMapConfig.getCurrZoom());
        properties.put("MIN_ZOOM", stateMapConfig.getMinZoom());
        properties.put("MAX_ZOOM", stateMapConfig.getMaxZoom());

        data.put("properties", properties);
        data.put("geoJSON", stateMap.getGeoJSON());

        System.out.println(data);

        return ResponseEntity.ok(data);
    }

    // @GetMapping("/state-info")
    // public ResponseEntity<Map<String, Object>> getStateInfo(
    //         @RequestParam(required = true) String state,
    //         @RequestParam(required = false) List<String> options) {

    //     ObjectMapper objectMapper = new ObjectMapper();

    //     String stateAbbr = "";

    //     switch(state){
    //         case "Utah": stateAbbr = "ut"; break;
    //         case "South Carolina": stateAbbr = "sc"; break;
    //     }

    //     String stateJSON = "src/main/resources/data/" + stateAbbr + "_info.json";

    //     try {
    //         // Read JSON file and map it to a generic Map
    //         Map<String, Object> data = objectMapper.readValue(new File(stateJSON), Map.class);
    //         System.out.println(data);

    //         return ResponseEntity.ok(data);
    //     } catch (IOException e) {
    //         e.printStackTrace();
    //     }

    //     return null;
    // }
}