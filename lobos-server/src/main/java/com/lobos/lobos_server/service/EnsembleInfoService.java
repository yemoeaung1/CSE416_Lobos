package com.lobos.lobos_server.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.lobos.lobos_server.model.Graph;
import com.lobos.lobos_server.enum_classes.DataFiltersEnum;
import com.lobos.lobos_server.enum_classes.MapFiltersEnum;
import com.lobos.lobos_server.model.GraphDataSet;

import com.lobos.lobos_server.model.EnsembleInfo;
import com.lobos.lobos_server.repository.EnsembleInfoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

