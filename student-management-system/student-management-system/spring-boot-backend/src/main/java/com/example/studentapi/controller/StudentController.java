package com.example.studentapi.controller;

import com.example.studentapi.model.Student;
import com.example.studentapi.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"})
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // GET /api/students/?search=&course=
    @GetMapping
    public List<Student> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String course) {
        return service.findAll(search, course);
    }

    // GET /api/students/{id}
    @GetMapping("/{id}")
    public Student getOne(@PathVariable Long id) {
        return service.findById(id);
    }

    // POST /api/students/
    @PostMapping
    public ResponseEntity<Student> create(@Valid @RequestBody Student student) {
        Student saved = service.create(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/students/{id}
    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @Valid @RequestBody Student student) {
        return service.update(id, student);
    }

    // DELETE /api/students/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        Student existing = service.findById(id);
        String name = existing.getFirstName() + " " + existing.getLastName();
        service.delete(id);
        return ResponseEntity.ok(Map.of("detail", "Student '" + name + "' was deleted successfully."));
    }
}
