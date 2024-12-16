package com.lobos.lobos_server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.repository.EnsembleInfoRepository;

@Service
public class EnsembleInfoService {
    private final EnsembleInfoRepository ensembleInfoRepository;

    @Autowired
    public EnsembleInfoService(EnsembleInfoRepository ensembleInfoRepository) {
        this.ensembleInfoRepository = ensembleInfoRepository;
    }

    public EnsembleInfo getEnsembleInfoForState(String state) {
        return ensembleInfoRepository.findFirstByState(state);
    }

    public List<EnsembleInfo> getAllEnsembleInfo() {
        return ensembleInfoRepository.findAll();  // Retrieves all EnsembleInfo from the DB
    }

     

}

