package com.lobos.lobos_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.repository.GraphRepository;

import java.util.Optional;

@Service
public class GraphService {
    private final GraphRepository graphRepository;
    private final StateInfoRepository stateInfoRepository;


    public GraphService(GraphRepository graphRepository) {
        this.graphRepository = graphRepository;
    }

    //Fetches the graph by its filter, e.g: 'party', 'race', 'income'
    public Graph getGraphByFilter(String filter) {
        Graph graph = graphRepository.findByGraphType(filter);
        //Add an error case?
        return graph;
    }
}
