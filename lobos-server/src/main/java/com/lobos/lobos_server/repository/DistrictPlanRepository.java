package com.lobos.lobos_server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.lobos.lobos_server.model.DistrictPlanInfo;


@Repository
public interface DistrictPlanRepository extends MongoRepository<DistrictPlanInfo, String>{
    DistrictPlanInfo findFirstByStateAndName(String state, String name);
}
