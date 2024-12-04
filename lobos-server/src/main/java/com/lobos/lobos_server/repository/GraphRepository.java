package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.Graph;

@Repository
public interface GraphRepository extends MongoRepository<Graph, String>{
    Graph findByGraphType(String filter);
}
