package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.StateMapConfig;

@Repository
public interface StateMapConfigRepository extends MongoRepository<StateMapConfig, String>{
    StateMapConfig findFirstByState(String state);
}
