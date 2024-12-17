package com.lobos.lobos_server;

// import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.DistrictInfo;
import com.lobos.lobos_server.model.DistrictPlanInfo;
import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.PrecinctInfo;
import com.lobos.lobos_server.service.DistrictService;
import com.lobos.lobos_server.service.GraphService;
import com.lobos.lobos_server.service.PrecinctService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RegionController {
    private final DistrictService districtService;
    private final PrecinctService precinctService;
    private final GraphService graphService;

    @Autowired
    public RegionController(
            DistrictService districtService,
            PrecinctService precinctService,
            GraphService graphService) {

        this.districtService = districtService;
        this.precinctService = precinctService;
        this.graphService = graphService;
    }

    @GetMapping("/precinct-data")
    public List<Map<String, Object>> getPrecinctData(@RequestParam String state) {
        return precinctService.getPrecinctDataByState(state);
    }

    @GetMapping("/precinct-entry")
    public ResponseEntity<PrecinctData> getPrecinctEntry(
            @RequestParam(required = true) String state) {

        PrecinctInfo precinctInfo = precinctService.getPrecinctInfo(state);

        return ResponseEntity.ok(precinctInfo.getPrecincts()[0]);
    }

    @GetMapping("/district-info")
    public ResponseEntity<Map<String, Object>> getDistrictInfo(
            @RequestParam(required = true) String state) {

        DistrictInfo info = districtService.getDistrictInfo(state);

        Map<String, Object> data = new HashMap<>();
        data.put("state", info.getState());
        data.put("data", info.getDistricts());
        data.put("representativeData", info.getRepresentativeData());

        return ResponseEntity.ok(data);
    }

    @GetMapping("/district-plan-geo")
    public ResponseEntity<Map<String, Object>> getDistrictPlanGeo(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String name) {

        DistrictPlanInfo info = districtService.getDistrictPlan(state, name);

        Map<String, Object> data = new HashMap<>();

        if(info != null){
            data.put("geoJSON", info.getGeoJSON());
            data.put("properties", info.getProperties());
        }

        return ResponseEntity.ok(data);
    }

    @GetMapping("/district-plan-graph")
    public ResponseEntity<Map<String, Object>> getDistrictPlanGraph(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String name,
            @RequestParam(required = true) String area,
            @RequestParam(required = true) String filter) {

        Map<String, Object> data = graphService.getGraphForDistrictPlan(state, name, area, filter);

        return ResponseEntity.ok(data);
    }
}