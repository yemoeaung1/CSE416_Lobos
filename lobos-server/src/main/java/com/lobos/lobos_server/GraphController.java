package com.lobos.lobos_server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lobos.lobos_server.enum_classes.MapViewsEnum;
import com.lobos.lobos_server.model.Graph;
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
    public ResponseEntity<?> getBarGraph(
            @RequestParam(required = true) String state,
            @RequestParam(required = true) String area,
            @RequestParam(required = true) String view,
            @RequestParam(required = true) String filter) {

        Graph graph = null;

        if (view.equals(MapViewsEnum.STATE.toString())){
            graph = graphService.getGraphForState(state, area, filter);
        }
        else if (view.equals(MapViewsEnum.DISTRICT.toString())){
            graph = graphService.getGraphForDistrict(state, area, filter);
        }
        else if (view.equals(MapViewsEnum.PRECINCT.toString())){
            graph = graphService.getGraphForPrecinct(state, area, filter);
        } else {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST) 
                .body("Invalid Map View");
        }

        return ResponseEntity.ok(graph);
    }
}
