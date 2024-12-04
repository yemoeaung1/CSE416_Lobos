package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.StateInfo;

@Repository
public interface StateInfoRepository extends MongoRepository<StateInfo, String>{
    StateInfo findFirstByState(String state);
}
