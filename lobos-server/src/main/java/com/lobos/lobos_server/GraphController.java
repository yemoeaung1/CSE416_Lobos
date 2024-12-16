package com.lobos.lobos_server;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lobos.lobos_server.model.EcologicalInferenceInfo;

import com.lobos.lobos_server.enum_classes.MapViewsEnum;
import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.service.GraphService;
import com.lobos.lobos_server.service.EcologicalInferenceService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {
    private final GraphService graphService;
    private final EcologicalInferenceService ecologicalInferenceService;

    @Autowired
    public GraphController(GraphService graphService, EcologicalInferenceService ecologicalInferenceService) {
        this.graphService = graphService;
        this.ecologicalInferenceService = ecologicalInferenceService;
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

    //Ecological Inference, needs the state and the filter
    @GetMapping("/ecological-inference")
    public ResponseEntity<?> getEcologicalInferenceGraph(@RequestParam String state, @RequestParam String filter, @RequestParam String filterOption) {
        try {
            Graph graph = ecologicalInferenceService.getEcologicalInferenceForState(state, filter, filterOption);
            return ResponseEntity.ok(graph);
        } 
        catch (RuntimeException e) {
            System.out.println(e);
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
