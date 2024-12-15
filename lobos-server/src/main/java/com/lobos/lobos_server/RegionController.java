package com.lobos.lobos_server;

// import com.lobos.lobos_server.enum_classes.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.service.DistrictService;
import com.lobos.lobos_server.service.StateService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class RegionController {
    private final StateService stateService;
    private final DistrictService districtService;

    @Autowired
    public RegionController(StateService stateService, DistrictService districtService) {
        this.stateService = stateService;
        this.districtService = districtService;
    }

    @GetMapping("/precinct-data")
    public List<Map<String, Object>> getPrecinctData(@RequestParam String state) {
        return stateService.getPrecinctDataByState(state);
    }

    @GetMapping("/district-info")
    public ResponseEntity<Map<String, Object>> getDistrictInfo(
        @RequestParam(required = true) String state) {

        Map<String, Object> data = districtService.getDistrictInfo(state);
        return ResponseEntity.ok(data);
    }
}