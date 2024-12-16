package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


import com.lobos.lobos_server.model.EnsembleInfo;

@Repository
public interface EnsembleInfoRepository extends MongoRepository<EnsembleInfo, String>{
    EnsembleInfo findFirstByState(String state);
}
