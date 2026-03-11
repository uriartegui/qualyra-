package com.qualyra.backend.domain.regression;

import com.qualyra.backend.domain.regression.dto.CreateRegressionRequest;
import com.qualyra.backend.domain.regression.dto.ExecuteItemRequest;
import com.qualyra.backend.domain.template.Template;
import com.qualyra.backend.domain.template.TemplateRepository;
import com.qualyra.backend.domain.user.User;
import com.qualyra.backend.infrastructure.exception.BusinessException;
import com.qualyra.backend.infrastructure.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RegressionService {

    private final RegressionRepository repository;
    private final TemplateRepository templateRepository;

    public RegressionService(RegressionRepository repository,
                             TemplateRepository templateRepository) {
        this.repository = repository;
        this.templateRepository = templateRepository;
    }

    @Transactional
    public Regression create(CreateRegressionRequest req, User currentUser) {
        Template template = templateRepository.findByIdWithRules(req.templateId())
                .filter(t -> t.getOrganization().getId()
                        .equals(currentUser.getOrganization().getId()))
                .filter(Template::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Template não encontrado"));

        if (template.getRules().isEmpty()) {
            throw new BusinessException("Template não possui regras cadastradas");
        }

        Regression regression = new Regression(
                currentUser.getOrganization(), template, req.name(), currentUser);

        // Cria um item para cada regra do template
        template.getRules().forEach(rule ->
                regression.getItems().add(new RegressionItem(regression, rule)));

        return repository.save(regression);
    }

    @Transactional(readOnly = true)
    public Page<Regression> findAll(User currentUser, Pageable pageable) {
        return repository.findByOrganization_Id(
                currentUser.getOrganization().getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Regression findById(UUID id, User currentUser) {
        return repository.findByIdWithItems(id)
                .filter(r -> r.getOrganization().getId()
                        .equals(currentUser.getOrganization().getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Regressão não encontrada"));
    }

    @Transactional
    public Regression executeItem(UUID regressionId, UUID itemId,
                                  ExecuteItemRequest req, User currentUser) {
        Regression regression = findById(regressionId, currentUser);

        if (regression.getStatus() == RegressionStatus.COMPLETED) {
            throw new BusinessException("Regressão já foi concluída");
        }

        RegressionItem item = regression.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));

        item.setResult(req.result());
        item.setNotes(req.notes());
        item.setExecutedBy(currentUser);
        item.setExecutedAt(Instant.now());

        return repository.save(regression);
    }

    @Transactional
    public Regression complete(UUID id, User currentUser) {
        Regression regression = findById(id, currentUser);

        if (regression.getStatus() == RegressionStatus.COMPLETED) {
            throw new BusinessException("Regressão já foi concluída");
        }

        boolean allExecuted = regression.getItems().stream()
                .allMatch(i -> i.getResult() != null);

        if (!allExecuted) {
            throw new BusinessException("Ainda há regras não executadas");
        }

        regression.setStatus(RegressionStatus.COMPLETED);
        regression.setCompletedAt(Instant.now());
        return repository.save(regression);
    }
}
