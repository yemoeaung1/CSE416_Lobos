package com.lobos.lobos_server;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lobos.lobos_server.model.EcologicalInferenceInfo;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.service.GraphService;
import com.lobos.lobos_server.service.EcologicalInferenceService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {
    private final GraphService graphService;
    private final EcologicalInferenceService ecologicalInferenceService;

    public GraphController(GraphService graphService, EcologicalInferenceService ecologicalInferenceService) {
        this.graphService = graphService;
        this.ecologicalInferenceService = ecologicalInferenceService;
    }

    //Bar graph
    @GetMapping("/bar")
    public ResponseEntity<?> getBarGraph(@RequestParam String state, @RequestParam String filter) {
        try {
            Graph graph = graphService.getGraphForState(state, filter);
            return ResponseEntity.ok(graph);
        } 
        catch (RuntimeException e) {
            System.out.println("Not Found");
            return ResponseEntity.status(404).body(e.getMessage());
        }
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
