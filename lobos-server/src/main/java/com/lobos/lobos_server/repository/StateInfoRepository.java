package com.lobos.lobos_server.repository;

import com.lobos.lobos_server.model.StateInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateInfoRepository extends MongoRepository<StateInfo, String> {
}
