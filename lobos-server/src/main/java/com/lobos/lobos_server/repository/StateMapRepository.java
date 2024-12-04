package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.StateMap;

@Repository
public interface StateMapRepository extends MongoRepository<StateMap, String>{
    StateMap findFirstByState(String state);
    StateMap findFirstByStateAndView(String state, String view);
}
