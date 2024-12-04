package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.Graph;

@Repository
public interface GraphRepository extends MongoRepository<Graph, String>{
        // Graph getGraphForState(String state, String filter);
        // Graph findByState(String state); // Assuming "state" exists in your Graph model

        // Graph findByGraphType(String graphType); // Existing method
}
