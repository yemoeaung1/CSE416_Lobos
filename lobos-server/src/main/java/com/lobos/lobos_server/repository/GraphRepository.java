package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.Graph;

import com.lobos.lobos_server.model.EcologicalInferenceInfo;

@Repository
public interface GraphRepository extends MongoRepository<EcologicalInferenceInfo, String>{
        // Graph getGraphForState(String state, String filter)  
        EcologicalInferenceInfo findByState(String state);
}
