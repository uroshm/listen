package com.slp;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.slp.entities.Widget;
import com.slp.services.WidgetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/widgets")
@RequiredArgsConstructor
public class WidgetController {

    private final WidgetService widgetService;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/getAllWidgets")
    public List<Widget> getAllWidgets() {
        return widgetService.getAllWidgets();
    }
}
