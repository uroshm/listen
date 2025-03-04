package com.slp.services;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.slp.entities.Widget;
import com.slp.repositories.WidgetRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Service
public class WidgetService {
    
    private final WidgetRepository widgetRepository;

    public List<Widget> getAllWidgets() {
        return widgetRepository.findAll();
    }
}
