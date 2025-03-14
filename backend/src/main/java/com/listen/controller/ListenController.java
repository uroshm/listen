package com.listen.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.listen.data.Widget;
import com.listen.services.ListenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/listen")
@RequiredArgsConstructor
public class ListenController {

  private final ListenService listenService;

  @CrossOrigin(origins = "http://localhost:5173")
  @GetMapping("/getAllWidgets")
  public List<Widget> getAllWidgets() {
    return listenService.getAllWidgets();
  }
}
