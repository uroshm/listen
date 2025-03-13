package com.listen.services;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.listen.data.Widget;
import com.listen.repositories.WidgetRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Service
public class ListenService {

  private final WidgetRepository widgetRepository;

  public List<Widget> getAllWidgets() {
    return widgetRepository.findAll();
  }
}
