package com.lobos.lobos_server;

// import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.PrecinctData;
import com.lobos.lobos_server.model.PrecinctInfo;
import com.lobos.lobos_server.service.DistrictService;
import com.lobos.lobos_server.service.PrecinctService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RegionController {
    private final DistrictService districtService;
    private final PrecinctService precinctService;

    @Autowired
    public RegionController(DistrictService districtService, PrecinctService precinctService) {
        this.districtService = districtService;
        this.precinctService = precinctService;
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

        Map<String, Object> data = districtService.getDistrictInfo(state);
        return ResponseEntity.ok(data);
    }
}