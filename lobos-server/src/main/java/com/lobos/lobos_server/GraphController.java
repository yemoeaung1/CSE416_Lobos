package com.lobos.lobos_server;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.enum_classes.MapViewsEnum;
import com.lobos.lobos_server.service.GraphService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {
    private final GraphService graphService;

    @Autowired
    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/graph-bar")
    public ResponseEntity<Map<String, Object>> getBarGraph(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String area,
            @RequestParam(required = true) String view,
            @RequestParam(required = true) String filter) {

        Map<String, Object> data = null;

        if (view.equals(MapViewsEnum.STATE.toString())){
            data = graphService.getGraphForState(state, area, filter);
        }
        else if (view.equals(MapViewsEnum.DISTRICT.toString())){
            data = graphService.getGraphForDistrict(state, area, filter);
        }
        else if (view.equals(MapViewsEnum.PRECINCT.toString())){
            data = graphService.getGraphForPrecinct(state, area, filter);
        }
        
        return ResponseEntity.ok(data);
    }
}
