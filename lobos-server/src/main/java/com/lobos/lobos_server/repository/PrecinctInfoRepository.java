package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.PrecinctInfo;

@Repository
public interface PrecinctInfoRepository extends MongoRepository<PrecinctInfo, String>{
    PrecinctInfo findFirstByState(String state);
}