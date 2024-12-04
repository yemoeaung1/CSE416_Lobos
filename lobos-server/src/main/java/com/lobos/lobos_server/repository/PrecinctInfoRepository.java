package com.lobos.lobos_server.repository;

import com.lobos.lobos_server.model.PrecinctInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PrecinctInfoRepository extends MongoRepository<PrecinctInfo, String> {
    Optional<PrecinctInfo> findFirstByState(String state);
}
