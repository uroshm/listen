package com.listen.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.listen.data.TranscriptionResult;
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

    @PostMapping("/uploadAudio")
    public TranscriptionResult uploadAudio(@RequestParam("file") MultipartFile file,
            @RequestParam("expectedText") String expectedText) {
        return listenService.uploadAudio(file, expectedText);
    }
}
