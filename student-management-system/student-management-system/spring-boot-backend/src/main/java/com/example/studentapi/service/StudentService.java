package com.example.studentapi.service;

import com.example.studentapi.exception.DuplicateEmailException;
import com.example.studentapi.exception.StudentNotFoundException;
import com.example.studentapi.model.Student;
import com.example.studentapi.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<Student> findAll(String search, String course) {
        if (search != null && !search.isBlank()) {
            return repository.search(search.trim());
        }
        if (course != null && !course.isBlank()) {
            return repository.findByCourseIgnoreCase(course.trim());
        }
        return repository.findAll();
    }

    public Student findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    public Student create(Student student) {
        if (repository.existsByEmailIgnoreCase(student.getEmail())) {
            throw new DuplicateEmailException(student.getEmail());
        }
        return repository.save(student);
    }

    public Student update(Long id, Student updated) {
        Student existing = findById(id);

        repository.findByEmailIgnoreCase(updated.getEmail())
                .filter(s -> !s.getId().equals(id))
                .ifPresent(s -> { throw new DuplicateEmailException(updated.getEmail()); });

        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setCourse(updated.getCourse());
        existing.setAddress(updated.getAddress());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Student existing = findById(id);
        repository.delete(existing);
    }
}
