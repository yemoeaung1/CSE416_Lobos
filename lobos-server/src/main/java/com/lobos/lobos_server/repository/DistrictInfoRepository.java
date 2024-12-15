package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.DistrictInfo;


@Repository
public interface DistrictInfoRepository extends MongoRepository<DistrictInfo, String>{
    DistrictInfo findFirstByState(String state);
}
