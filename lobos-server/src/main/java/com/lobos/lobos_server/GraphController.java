package com.lobos.lobos_server;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.service.GraphService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {
    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    // @GetMapping("/bar")
    // public BarGraph getBarGraph(@RequestParam String type) {
    //     BarGraph barGraph = new BarGraph();
    //     barGraph.setTitle("Support for Candidates by Party");
    //     barGraph.setxLabel("Political Party");
    //     barGraph.setyLabel("Number of People");

    //     // Set data sets 
    //     List<DataSet> dataSets = List.of(
    //         new DataSet("Republican", List.of(8020), "rgba(255, 0, 0, 0.5)", "black", 1),
    //         new DataSet("Democrat", List.of(1890), "rgba(0, 0, 255, 0.5)", "black", 1),
    //         new DataSet("Independent", List.of(300), "rgba(0, 255, 0, 0.5)", "black", 1)
    //     );
    //     barGraph.setDataSets(dataSets);

    //     return barGraph;
    // }
    // @GetMapping("/bar")
    // public Graph getBarGraph(@RequestParam String filter) {
    //     return graphService.getGraphByFilter(filter);
    // }
    @GetMapping("/bar")
    public ResponseEntity<?> getBarGraph(@RequestParam String state, @RequestParam String filter) {
        System.out.println("Getting the Bar Graph");
        try {
            Graph graph = graphService.getGraphForState(state, filter);
            return ResponseEntity.ok(graph);
        } catch (RuntimeException e) {
            System.out.println("Not Found");
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    
    // public ResponseEntity<Map<String, Object>> getStateMap(
    //             @RequestParam(required = true) String state,
    //             @RequestParam(required = true) String view) {


    //         return ResponseEntity.ok(data);
    //     }

}
